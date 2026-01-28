const supabase = require('../config/supabase');

// ---- User Operations ---- //

const userDB = {
    // -- Get All Users -- //

    async getAllUsers() {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .order('user_name', { ascending: true });

            if (error) throw error;
            return data || [];
    },

    async getUserByName(username) {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('user_name', username)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return data || null;
    },

    async login(username, password) {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('user_name', username)
            .eq('password', password)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error; // ignore no-match
        return data || null;
    },


    async register(username, password) {
        const { data, error } = await supabase
            .from('user')
            .insert([{ user_name: username, password: password, isAuthenticated: false, isAdmin: false }])
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async getIsAuthenticated(username) {
        const { data, error } = await supabase
            .from('user')
            .select('isAuthenticated')
            .eq('user_name', username)
            .maybeSingle();
        if (error && error.code !== 'PGRST116') throw error; // ignore no-match
        return data ? data.isAuthenticated : null;
    },

    async setIsAuthenticated(username, isAuthenticated) {
        const { data, error } = await supabase
            .from('user')
            .update({ isAuthenticated: isAuthenticated })
            .eq('user_name', username)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async getIsAdmin(username) {
        const { data, error } = await supabase
            .from('user')
            .select('isAdmin')
            .eq('user_name', username)
            .maybeSingle();
        if (error && error.code !== 'PGRST116') throw error; // ignore no-match
        return data ? data.isAdmin : null;
    },

    async setIsAdmin(username, isAdmin) {
        const { data, error } = await supabase
            .from('user')
            .update({ isAdmin: isAdmin })
            .eq('user_name', username)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async deleteUser(username) {
        const {data, error } = await supabase
            .from('user')
            .delete()
            .eq('user_name', username)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async updateUsername(oldUsername, newUsername) {
        const { data, error } = await supabase
            .from('user')
            .update({ user_name: newUsername })
            .eq('user_name', oldUsername)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async updatePassword(username, newPassword) {
        const { data, error } = await supabase
            .from('user')
            .update({ password: newPassword })
            .eq('user_name', username)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async getUserById(userId) {
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },

    async getAllUsersWithDetails() {
        const { data, error } = await supabase
            .from('user')
            .select('id, user_name, isAuthenticated, isAdmin, created_at')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async setIsAuthenticatedById(userId, isAuthenticated) {
        const { data, error } = await supabase
            .from('user')
            .update({ isAuthenticated: isAuthenticated })
            .eq('id', userId)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async setIsAdminById(userId, isAdmin) {
        const { data, error } = await supabase
            .from('user')
            .update({ isAdmin: isAdmin })
            .eq('id', userId)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async deleteUserById(userId) {
        const { data, error } = await supabase
            .from('user')
            .delete()
            .eq('id', userId)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    }

};

// ---- Gift Operations ---- //

const giftDB = {
    async addGift(userId, description, price, giftOrder) {
        const { data, error } = await supabase
            .from('gifts')
            .insert([{
                user_id: userId,
                gift_description: description,
                price: price,
                gift_order: giftOrder
            }])
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async getGiftsByUser(userId) {
        const { data, error } = await supabase
            .from('gifts')
            .select('*')
            .eq('user_id', userId)
            .order('gift_order', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async updateGift(giftId, description, price) {
        const { data, error } = await supabase
            .from('gifts')
            .update({ gift_description: description, price: price })
            .eq('id', giftId)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async deleteGift(giftId) {
        const { data, error } = await supabase
            .from('gifts')
            .delete()
            .eq('id', giftId)
            .select()
            .single();
        if (error) throw error;
        return data || null;
    },

    async getGiftCount(userId) {
        const { count, error } = await supabase
            .from('gifts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        if (error) throw error;
        return count || 0;
    }
};

// ---- Secret Valentines Operations ---- //

const secretValentinesDB = {
    async assignValentines() {
        // Get all authenticated users
        const { data: users, error: usersError } = await supabase
            .from('user')
            .select('id')
            .eq('isAuthenticated', true);
        if (usersError) throw usersError;

        if (users.length < 2) {
            throw new Error('Need at least 2 authenticated users to assign valentines');
        }

        // Shuffle users for random assignment
        const shuffled = [...users].sort(() => Math.random() - 0.5);

        // Create circular assignment (no one gets themselves)
        const assignments = [];
        for (let i = 0; i < shuffled.length; i++) {
            assignments.push({
                from_user_id: shuffled[i].id,
                to_user_id: shuffled[(i + 1) % shuffled.length].id
            });
        }

        // Insert assignments
        const { data, error } = await supabase
            .from('secret_valentines')
            .insert(assignments)
            .select();
        if (error) throw error;
        return data || [];
    },

    async getAssignedValentine(userId) {
        const { data, error } = await supabase
            .from('secret_valentines')
            .select('to_user_id')
            .eq('from_user_id', userId)
            .maybeSingle();
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },

    async getValentineInfo(toUserId) {
        const { data, error } = await supabase
            .from('user')
            .select('id, user_name')
            .eq('id', toUserId)
            .maybeSingle();
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    },

    async clearAssignments() {
        const { error } = await supabase
            .from('secret_valentines')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
    }
};

module.exports = { userDB, giftDB, secretValentinesDB };