// Map categories to emojis dynamically
const emojiMap = {
    'politics': '🏛️',
    'education': '📚',
    'health': '🏥',
    'sports': '⚽',
    'entertainment': '🎬',
    'research': '🧠',
    'default': '📰'
};

async function renderNewsPage() {
    console.log("🚀 CONTROLLER: Initializing news page rendering...");
    try {
        if (!window.DB || !window.DB.getAllNews) {
            throw new Error("window.DB.getAllNews is not defined. check if supabaseService.js is loaded first!");
        }

        const articles = await window.DB.getAllNews();
        console.log(`📊 CONTROLLER: Received ${articles ? articles.length : 0} articles.`);

        if (!articles || articles.length === 0) {
            document.getElementById('featured-story-target').innerHTML = "<p>No articles found.</p>";
            document.getElementById('news-grid-target').innerHTML = "";
            return;
        }

        // =======================================================
        // 1. RENDER TOP FEATURED STORY
        // =======================================================
        const topStory = articles[0];
        const topEmoji = emojiMap[topStory.category?.toLowerCase()] || emojiMap.default;
        
        // Formating the date cleanly
        const formattedDate = new Date(topStory.created_at).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });

        // 🔥 FIX: Defining previewText safely before passing it below
        const previewText = topStory.content ? topStory.content.substring(0, 150) + '...' : 'No preview available.';

        document.getElementById('featured-story-target').innerHTML = `
            <div class="featured-card">
              <div class="card-img" style="background: linear-gradient(145deg, #bfa48f, #a88971);">
                <span style="font-size:5rem;">${topEmoji}</span>
                <span class="badge"><i class="fas fa-bolt" style="margin-right:6px;"></i>Top story</span>
              </div>
              <div class="card-body">
                <h2><a href="article.html?id=${topStory.id}">${topStory.title}</a></h2>
                <div class="meta">
                  <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                  <span><i class="far fa-user"></i> By ${topStory.author || 'Staff'}</span>
                  <span style="text-transform: capitalize;"><i class="far fa-folder-open"></i> ${topStory.category}</span>
                </div>
                <p class="excerpt">${previewText}</p> 
                <a href="article.html?id=${topStory.id}" class="read-more" style="display:inline-flex;align-items:center;gap:8px;margin-top:12px;font-weight:600;color:var(--secondary);">Read full story <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
        `;

        // =======================================================
        // 2. RENDER THE GRID CARDS (The remaining 4 articles)
        // =======================================================
        const gridArticles = articles.slice(1);
        let gridHTML = '';

        gridArticles.forEach(article => {
            const artEmoji = emojiMap[article.category?.toLowerCase()] || emojiMap.default;
            
            gridHTML += `
              <div class="news-card">
                <div class="card-img-sm">${artEmoji}</div>
                <div class="card-body">
                  <span class="cat-tag" style="text-transform: capitalize;">${article.category}</span>
                  <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
                  <div class="meta" style="font-size:0.8rem;margin:6px 0 0;">
                    <span><i class="far fa-calendar-alt"></i> ${new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            `;
        });

        document.getElementById('news-grid-target').innerHTML = gridHTML;
        console.log("🎨 CONTROLLER: Successfully rendered news cards to HTML targets.");

    } catch (err) {
        console.error("💥 CONTROLLER CRASH:", err);
        document.getElementById('featured-story-target').innerHTML = `<p>Error loading news: ${err.message}</p>`;
    }
}

renderNewsPage();