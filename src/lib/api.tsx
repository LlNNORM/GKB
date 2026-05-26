import { supabase } from './supabaseClient';
export { supabase } from './supabaseClient';

export interface Transaction {
    id: string;
    type: 'add' | 'deduct';
    amount: number;
    description: string;
    created_at: string;
}

// ==================== AUTH ====================

export const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
    });
    if (error) throw error;
    return data;
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentUser = async () => {
    console.log("🔍 getCurrentUser: вызываю supabase.auth.getUser()");
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error("🔍 getCurrentUser: ошибка", error);
        return null;
    }
    console.log("🔍 getCurrentUser: пользователь получен", user?.email);
    return user;
};

// ==================== BALANCE ====================

// export const getBalance = async (): Promise<number> => {
//     const { data, error } = await supabase
//         .from('global_balance')
//         .select('balance')
//         .single();

//     if (error) {
//         console.error('Error fetching balance:', error);
//         return 1000;
//     }
//     return data?.balance ?? 1000;
// };
// export const getBalance = async (): Promise<number> => {
//     console.log("🟡 getBalance: START");
//     try {
//         console.log("🟡 getBalance: выполняю запрос...");
//         const response = await supabase
//             .from('global_balance')
//             .select('balance');
        
//         console.log("🟡 getBalance: ответ получен", response);
        
//         if (response.error) {
//             console.error("🟡 getBalance: ошибка", response.error);
//             return 1000;
//         }
        
//         if (response.data && response.data.length > 0) {
//             console.log("🟡 getBalance: данные есть", response.data[0].balance);
//             return response.data[0].balance;
//         }
        
//         console.log("🟡 getBalance: данных нет, создаю...");
//         const { error: insertError } = await supabase
//             .from('global_balance')
//             .insert({ balance: 1000 });
        
//         if (insertError) {
//             console.error("🟡 getBalance: ошибка создания", insertError);
//         }
//         return 1000;
//     } catch (error) {
//         console.error("🟡 getBalance: исключение", error);
//         return 1000;
//     }
// };
// export const getBalance = async (): Promise<number> => {
//     console.log("🟡 getBalance: START");
//     try {
//         const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/global_balance?select=balance`;
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
//                 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!}`
//             }
//         });
        
//         console.log("🟡 fetch response status:", response.status);
        
//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//         }
        
//         const data = await response.json();
//         console.log("🟡 getBalance: данные", data);
        
//         if (data && Array.isArray(data) && data.length > 0) {
//             return data[0].balance;
//         }
//         return 1000;
//     } catch (error) {
//         console.error("🟡 getBalance: ошибка", error);
//         return 1000;
//     }
// };
export const getBalance = async (): Promise<number> => {
    console.log("🟡 getBalance: START");
    console.log("🟡 getBalance: URL =", import.meta.env.VITE_SUPABASE_URL);
    
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/global_balance?select=balance`;
    console.log("🟡 getBalance: полный URL =", url);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!}`
            }
        });
        
        console.log("🟡 getBalance: статус ответа =", response.status);
        const data = await response.json();
        console.log("🟡 getBalance: данные =", data);
        return data[0]?.balance ?? 1000;
    } catch (error) {
        console.error("🟡 getBalance: ошибка", error);
        return 1000;
    }
};
export const updateBalance = async (newBalance: number): Promise<void> => {
    const { error } = await supabase
        .from('global_balance')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', (await supabase.from('global_balance').select('id').single()).data?.id);

    if (error) throw error;
};

// ==================== TRANSACTIONS ====================

// export const getTransactions = async (): Promise<Transaction[]> => {
//     const user = await getCurrentUser();
//     if (!user) return [];

//     const { data, error } = await supabase
//         .from('transactions')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('created_at', { ascending: false });

//     if (error) {
//         console.error('Error fetching transactions:', error);
//         return [];
//     }
//     return data || [];
// };
export const getTransactions = async (): Promise<Transaction[]> => {
    console.log("🟢 getTransactions: START");
    const user = await getCurrentUser();
    console.log("🟢 getTransactions: user =", user?.email);
    
    if (!user) {
        console.log("🟢 getTransactions: нет пользователя, возвращаем []");
        return [];
    }

    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("🟢 getTransactions: ERROR", error);
        return [];
    }
    console.log("🟢 getTransactions: SUCCESS, count =", data?.length);
    return data || [];
};

export const addTransaction = async (
    type: 'add' | 'deduct',
    amount: number,
    description: string
): Promise<void> => {
    const user = await getCurrentUser();
    if (!user) throw new Error('No user');

    const { error } = await supabase
        .from('transactions')
        .insert({
            user_id: user.id,
            type,
            amount,
            description
        });

    if (error) throw error;
};

// ==================== REALTIME ====================

export const subscribeToBalanceChanges = (callback: (balance: number) => void) => {
    const channel = supabase
        .channel('balance-changes')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'global_balance'
            },
            async (payload) => {
                callback(payload.new.balance);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};