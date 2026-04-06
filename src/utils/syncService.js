import { supabase } from './supabase'
import { user } from './authService'

export const syncService = {
    /**
     * Sync User Settings
     */
    async syncSettings(settings) {
        if (!user.value || !supabase) return
        const { data, error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: user.value.id,
                daily_goal: settings.dailyGoal,
                study_mode: settings.studyMode,
                purpose: settings.purpose,
                theme: settings.theme,
                // API key is local-only; overwrite any previously synced value.
                api_key: '',
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
        return { data, error }
    },

    /**
     * Sync Vocabulary Progress
     */
    async syncVocabularyProgress(vocabId, progress) {
        if (!user.value || !supabase) return
        const { data, error } = await supabase
            .from('vocabulary_progress')
            .upsert({
                user_id: user.value.id,
                vocab_id: vocabId,
                learned_words: progress.learned || [],
                forgotten_words: progress.forgotten || [],
                current_index: progress.currentIndex || 0,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,vocab_id' })
        return { data, error }
    },

    /**
     * Sync Wordbook
     */
    async syncWordbook(wordId, vocabId, isAdding) {
        if (!user.value || !supabase) return
        if (isAdding) {
            return await supabase
                .from('wordbook')
                .upsert({
                    user_id: user.value.id,
                    word_id: wordId,
                    vocab_id: vocabId
                })
        } else {
            return await supabase
                .from('wordbook')
                .delete()
                .match({ user_id: user.value.id, word_id: wordId, vocab_id: vocabId })
        }
    },


    /**
     * Sync All Data (Full Pull/Push)
     * This is called after initial login
     */
    async fullSync() {
        if (!user.value || !supabase) return
        const userId = user.value.id
        if (!user.value || !supabase) return
        const userId = user.value.id

        // 1. Fetch cloud settings
        const { data: cloudSettings } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()

        // 2. Fetch cloud progress
        const { data: cloudProgress } = await supabase
            .from('vocabulary_progress')
            .select('*')
            .eq('user_id', userId)

        // 3. Fetch cloud wordbook
        const { data: cloudWordbook } = await supabase
            .from('wordbook')
            .select('*')
            .eq('user_id', userId)

        // 4. Fetch cloud SRS states
        const { data: cloudSRS } = await supabase
            .from('word_review_states')
            .select('*')
            .eq('user_id', userId)

        // 5. Fetch cloud history
        const { data: cloudHistory } = await supabase
            .from('study_history')
            .select('*')
            .eq('user_id', userId)

        // 6. Fetch cloud achievements
        const { data: cloudAchievements } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', userId)

        return {
            cloudSettings,
            cloudProgress,
            cloudWordbook,
            cloudSRS,
            cloudHistory,
            cloudAchievements
        }
    },

    /**
     * Sync Word Review State (SRS)
     */
    async syncReviewState(vocabId, wordId, state) {
        if (!user.value || !supabase) return
        const { data, error } = await supabase
            .from('word_review_states')
            .upsert({
                user_id: user.value.id,
                vocab_id: vocabId,
                word_id: wordId,
                interval_level: state.intervalLevel,
                ease_factor: state.easeFactor,
                next_review: state.nextReview ? new Date(state.nextReview).toISOString() : null,
                last_review: state.lastReview ? new Date(state.lastReview).toISOString() : null,
                review_count: state.reviewCount || 0,
                correct_count: state.correctCount || 0,
                incorrect_count: state.incorrectCount || 0,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,vocab_id,word_id' })
        return { data, error }
    },

    /**
     * Sync Study History
     */
    async syncStudyHistory(date, wordsLearned, studyTimeSeconds) {
        if (!user.value || !supabase) return
        const { data, error } = await supabase
            .from('study_history')
            .upsert({
                user_id: user.value.id,
                date,
                words_learned: wordsLearned,
                study_time_seconds: studyTimeSeconds,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,date' })
        return { data, error }
    },

    /**
     * Sync Achievement
     */
    async syncAchievement(achievementId) {
        if (!user.value || !supabase) return
        const { data, error } = await supabase
            .from('achievements')
            .upsert({
                user_id: user.value.id,
                achievement_id: achievementId,
                unlocked_at: new Date().toISOString()
            }, { onConflict: 'user_id,achievement_id' })
        return { data, error }
    }
}
