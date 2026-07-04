// 1. Setup the connection
const { createClient } = supabase;
const SUPABASE_URL = 'https://nrgyqpujjfkkcfyljvgc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HfO1WcUv47_M4fFnCalYtw_kqPfbYq4';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Put all your fetching/requesting functions here
window.DB = {
    // Function to get a specific item by ID
    async getUserById(id) {
        const { data, error } = await supabaseClient
            .from('Users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Function to create a new user (POST request equivalent)
    async createNewUser(userEmail, userName) {
        const { data, error } = await supabaseClient
            .from('Users')
            .insert([
                { 
                    Email: userEmail,   // Matches your 'email' column
                    Username: userName  // Matches your new 'username' column
                }
            ])
            .select();

        if (error) throw error;
        return data; 
    },

    async getAllNews() {
        console.log("🔄 DB SERVICE: Attempting to fetch articles from table 'News'...");
        
        const { data, error } = await supabaseClient
            .from('News') 
            .select('*')
            .order('created_at', { ascending: false }); 

        if (error) {
            console.error("❌ DB SERVICE ERROR: Supabase rejected the request!");
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            console.error("Error Details:", error.details);
            throw error; 
        }

        console.log("✅ DB SERVICE SUCCESS: Received data from Supabase:", data);
        return data; 
    }

};