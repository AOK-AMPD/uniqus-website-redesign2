// Uniqus Consultech - Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Handle initial scroll state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Add mouse move effect to hero cards
    const heroVisuals = document.querySelector('.hero-visuals');
    const cards = document.querySelectorAll('.glass-card');

    if (heroVisuals) {
        heroVisuals.addEventListener('mousemove', (e) => {
            const rect = heroVisuals.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            cards.forEach((card, index) => {
                const depth = (index + 1) * 10;
                const moveX = deltaX * depth;
                const moveY = deltaY * depth;

                // apply a gentle parralax
                card.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        heroVisuals.addEventListener('mouseleave', () => {
            cards.forEach(card => {
                card.style.transform = '';
            });
        });
    }

    // 3D Globe Implementation
    const globeContainer = document.getElementById('globeViz');
    if (globeContainer && window.Globe) {
        globeContainer.innerHTML = ''; // clear any existing content
        const initialTheme = localStorage.getItem('theme') || 'dark';
        const initialGlobeUrl = initialTheme === 'light' ? 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg' : 'https://unpkg.com/three-globe/example/img/earth-dark.jpg';

        const world = Globe()(globeContainer)
            .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
            .showAtmosphere(true)
            .atmosphereColor('rgba(138, 43, 226, 0.4)')
            .atmosphereAltitude(0.2)
            .globeImageUrl(initialGlobeUrl);

        window.uniqusGlobe = world;

        // Map points for Uniqus
        const markerData = [
            {
                lat: 39.8283, lng: -98.5795, label: 'United States',
                offices: [
                    'Offices in: San Jose, New York',
                    'San Jose — 100 Century Court, Suite 410, San Jose, California – 95112',
                    'New York — 109 West 27th Street, Suite 4S, New York, New York – 10001'
                ]
            },
            {
                lat: 20.5937, lng: 78.9629, label: 'India',
                offices: [
                    'Offices in: Mumbai, Gurugram, Bengaluru, Chennai, Noida, Pune',
                    'Mumbai — 703, 7th Floor, Peninsula Tower Wing A, Lower Parel – 400013',
                    'Gurugram — 15th Floor, Building 9A, DLF Cyber City, Sector 24 – 122002',
                    'Bengaluru — 315 Work Avenue KRM 1, Tower II, Koramangala – 560034',
                    'Chennai — Prestige Palladium Bayan, 8th Floor, Egmore – 600006',
                    'Noida — Office 1632, 16th Floor, Max Tower, Sector 16B – 201301',
                    'Pune — Unit No. 302, Sprint Wakdewadi, Shivajinagar – 411005'
                ]
            },
            {
                lat: 25.276987, lng: 55.296249, label: 'Middle East',
                offices: [
                    'Offices in: Dubai, Abu Dhabi, Riyadh',
                    'Dubai — Office Tower Level 17, Central Park Towers, DIFC, Dubai',
                    'Abu Dhabi — 3009, 30th Floor, Tamouh Tower 12, Reem Island',
                    'Riyadh — Office No. 2, 3rd Floor, North Tower, Abraj Attawuneya'
                ]
            }
        ];

        world.htmlElementsData(markerData)
            .htmlElement(d => {
                const el = document.createElement('div');
                const officesHtml = d.offices.map(o => `<div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">${o}</div>`).join('');
                el.innerHTML = `
                    <div class="globe-marker" style="text-align: center; cursor: pointer; position: relative; pointer-events: auto;" onmouseenter="this.querySelector('.tooltip').style.opacity=1; this.querySelector('.tooltip').style.transform='translateY(0)';" onmouseleave="this.querySelector('.tooltip').style.opacity=0; this.querySelector('.tooltip').style.transform='translateY(10px)';">
                        <div style="font-size: 24px; animation: pulse 2s infinite;">📍</div>
                        <div style="color: white; font-weight: bold; font-family: Outfit, sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.8); background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(138,43,226,0.3); margin-top: 5px;">
                            ${d.label}
                        </div>
                        <div class="tooltip" style="position: absolute; bottom: 100%; left: 50%; margin-left: -200px; width: 400px; background: rgba(10,10,15,0.95); border: 1px solid rgba(138,43,226,0.4); border-radius: 8px; padding: 15px; color: rgba(255,255,255,0.8); font-size: 0.8rem; text-align: left; opacity: 0; transform: translateY(10px); transition: all 0.3s ease; pointer-events: none; margin-bottom: 10px; z-index: 100;">
                            <div style="font-weight: bold; font-size: 1rem; margin-bottom: 8px; color: var(--color-primary-light); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">${d.label} Offices</div>
                            ${officesHtml}
                        </div>
                    </div>
                `;
                el.style.transform = 'translate(-50%, -50%)';
                return el;
            });

        // Auto-rotate
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.8;
        world.controls().enableZoom = false;

        // Initial viewport focus
        world.pointOfView({ lat: 20, lng: 40, altitude: 3.5 });
    }

    // Products Interactive Tabs
    const tabs = document.querySelectorAll('.product-tab');
    const panes = document.querySelectorAll('.product-pane');
    let productInterval;

    function switchTab(targetId) {
        // Remove active class from all tabs and panes
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        // Add active class to target
        const targetTab = Array.from(tabs).find(t => t.dataset.product === targetId);
        const targetPane = document.getElementById(`pane-${targetId}`);

        if (targetTab && targetPane) {
            targetTab.classList.add('active');
            targetPane.classList.add('active');

            // Handle timeline progress
            const timelineProgress = document.getElementById('product-timeline-progress');
            if (timelineProgress && targetTab) {
                timelineProgress.style.height = `${targetTab.offsetHeight}px`;
                timelineProgress.style.top = `${targetTab.offsetTop}px`;
            }
        }
    }

    function startAutoScroll() {
        productInterval = setInterval(() => {
            const currentActive = document.querySelector('.product-tab.active');
            // the next sibling might be the timeline indicator divs, so look specifically for .product-tab
            let nextTab = currentActive.nextElementSibling;
            while (nextTab && !nextTab.classList.contains('product-tab')) {
                nextTab = nextTab.nextElementSibling;
            }
            if (!nextTab) {
                // Find first product-tab
                nextTab = document.querySelector('.product-tab');
            }
            switchTab(nextTab.dataset.product);
        }, 5000); // 5 seconds
    }

    if (tabs.length > 0) {
        // Add click event listeners
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                clearInterval(productInterval); // Stop auto-scroll on manual click
                switchTab(tab.dataset.product);
            });
        });

        // Start initial auto-scroll
        startAutoScroll();
    }

    // Chatbot Logic
    // System instruction injected using the content.txt data
    const systemPrompt = `You are a helpful AI assistant for Uniqus Consultech, a global tech-enabled consulting company.
Uniqus offers 4 main services:
1. ARC (Accounting & Reporting Consulting)
2. GRC (Governance, Risk & Compliance)
3. SCC (Sustainability & Climate Consulting)
4. Tech Consulting (Including AI UniVerse)

Uniqus has proprietary products: UniQuest (GenAI research), Risk UniVerse, Reporting UniVerse, and ESG UniVerse.
They serve clients globally across the US, India, and the Middle East, with over 500 professionals.
Always be polite, professional, and concise. Only answer questions related to Uniqus. Direct users to the contact form at the bottom of the page to schedule meetings.`;

    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input-field');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('hidden');
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.add('hidden');
        });

        let chatHistory = [];

        function parseMarkdown(text) {
            let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
            formatted = formatted.replace(/\n- (.*?)(?=\n|$)/g, '<br>• $1');
            formatted = formatted.replace(/\n\* (.*?)(?=\n|$)/g, '<br>• $1');
            return formatted.replace(/\n/g, '<br>');
        }

        async function handleChatMsg() {
            const text = chatbotInput.value.trim();
            if (text === '') return;

            // Generate user message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-msg user-msg';
            userMsg.innerHTML = parseMarkdown(text);
            chatbotMessages.appendChild(userMsg);
            chatbotInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Maintain context array
            chatHistory.push({ role: "user", parts: [{ text }] });

            // Show typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.className = 'chat-msg ai-msg';
            typingMsg.textContent = 'Thinking...';
            chatbotMessages.appendChild(typingMsg);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            try {
                // Now calls YOUR Netlify function instead of Google directly
                const response = await fetch("/.netlify/functions/ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chatHistory,
                        systemPrompt
                    })
                });

                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                const data = await response.json();
                const aiResponseText = data.candidates
                    ? data.candidates[0].content.parts[0].text
                    : "Sorry, I encountered an error computing the response.";

                typingMsg.innerHTML = parseMarkdown(aiResponseText);

                if (data.candidates) {
                    chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
                }

            } catch (error) {
                typingMsg.textContent = error.message || "Apologies, I'm currently unable to connect to my knowledge base.";
            }

            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        chatbotSend.addEventListener('click', handleChatMsg);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatMsg();
        });
    }

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const updateThemeIcon = (theme) => {
        themeToggle.textContent = theme === 'light' ? '🌙' : '🌞';
    };

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);

            if (window.uniqusGlobe) {
                window.uniqusGlobe.globeImageUrl(newTheme === 'light' ? 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg' : 'https://unpkg.com/three-globe/example/img/earth-dark.jpg');
            }
        });
    }
});
