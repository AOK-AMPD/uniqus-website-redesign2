// Uniqus Consultech - Interactions

// Core Audio - Snap Sound
window.playSnapSound = function () {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
};
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

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

    // Hero Interaction is now CSS-driven (Floating Cards)


    // Why Uniqus - Box Accordion Interaction
    const whyBoxes = document.querySelectorAll('.why-box');
    whyBoxes.forEach(box => {
        box.addEventListener('click', function () {
            if (this.classList.contains('active')) {
                this.classList.remove('active'); // allow click to close
                return;
            }

            whyBoxes.forEach(b => b.classList.remove('active')); // close siblings
            this.classList.add('active'); // open current
        });
    });

    // Base Plate Builder Interaction
    const plateTabs = document.querySelectorAll('.plate-tab');
    const plateContents = document.querySelectorAll('.plate-content');
    const basePlateBoard = document.getElementById('base-plate-board');
    const detailPanel = document.getElementById('brick-detail-panel');
    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');

    if (plateTabs.length > 0 && basePlateBoard) {
        let isAnimating = false;

        plateTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                if (this.classList.contains('active') || isAnimating) return;
                isAnimating = true;

                // Play sound
                if (window.playSnapSound) window.playSnapSound();

                const targetPlateId = `plate-${this.getAttribute('data-plate')}`;
                const currentActiveTab = document.querySelector('.plate-tab.active');
                const currentActiveContent = document.querySelector('.plate-content.active');

                // 1. Tab styles
                if (currentActiveTab) currentActiveTab.classList.remove('active');
                this.classList.add('active');

                // Reset detail panel
                if (detailTitle) detailTitle.textContent = "Select a brick";
                if (detailDesc) detailDesc.textContent = "Click on any module above to learn more.";

                // Clear selected bricks
                document.querySelectorAll('.sub-service-brick.selected').forEach(b => b.classList.remove('selected'));

                // 2. Animate out current bricks
                if (currentActiveContent) {
                    const oldBricks = currentActiveContent.querySelectorAll('.sub-service-brick');
                    oldBricks.forEach(brick => {
                        brick.classList.remove('animate-fly-in');
                        brick.classList.add('anim-out');
                    });

                    // 3. Animate the board snapping down
                    setTimeout(() => {
                        basePlateBoard.classList.add('anim-out');
                    }, 100);

                    // 4. Swap content and fly new ones in
                    setTimeout(() => {
                        currentActiveContent.classList.remove('active');
                        oldBricks.forEach(brick => brick.classList.remove('anim-out'));

                        const newContent = document.getElementById(targetPlateId);
                        if (newContent) newContent.classList.add('active');

                        // Board pops back in
                        basePlateBoard.classList.remove('anim-out');
                        if (window.playSnapSound) window.playSnapSound();

                        // Bricks fly in staggered
                        if (newContent) {
                            const newBricks = newContent.querySelectorAll('.sub-service-brick');
                            newBricks.forEach(brick => {
                                brick.classList.add('animate-fly-in');
                            });
                        }

                        setTimeout(() => { isAnimating = false; }, 800); // Wait for animations
                    }, 400);

                }
            });
        });

        // Brick click to view details
        document.querySelectorAll('.sub-service-brick').forEach(brick => {
            brick.addEventListener('click', function () {
                // Remove selected from all
                document.querySelectorAll('.sub-service-brick.selected').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');

                if (window.playSnapSound) window.playSnapSound();

                if (detailTitle) detailTitle.textContent = this.getAttribute('data-title');
                if (detailDesc) detailDesc.textContent = this.getAttribute('data-ex-desc');
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
            .backgroundColor('#070720')
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

        // Initial empty state
        world.htmlElementsData([]);

        // Intersection Observer for dropping pins
        const globeSection = document.getElementById('global-presence');
        if (globeSection) {
            const globeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Drop the pins with a slight delay
                        setTimeout(() => {
                            world.htmlElementsData(markerData)
                                .htmlElement(d => {
                                    const el = document.createElement('div');
                                    const officesHtml = d.offices.map(o => `<div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">${o}</div>`).join('');
                                    const animDelay = (markerData.indexOf(d) * 0.15) + 's';
                                    el.innerHTML = `
                                        <div class="globe-marker-container" style="position: relative; cursor: pointer;">
                                            <!-- The Pin -->
                                            <div class="globe-pin globe-pin-animated" style="width: 14px; height: 14px; background: var(--color-primary-light); border-radius: 50%; box-shadow: 0 0 15px var(--color-primary); border: 2px solid white; transition: transform 0.3s; pointer-events: auto; opacity: 0; animation-delay: ${animDelay};"></div>
                                            <!-- Pulse effect -->
                                            <div class="globe-pulse" style="position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; border-radius: 50%; border: 1px solid var(--color-primary); animation: pulse 2s infinite; pointer-events: none; opacity: 0; animation-delay: ${animDelay}; transition: opacity 0.5s;"></div>
                                            
                                            <!-- Click Card (hidden by default) -->
                                            <div class="globe-hover-card">
                                                <button class="globe-card-close" title="Close">&times;</button>
                                                <h4 style="font-size: 1.1rem; color: var(--color-primary-light); margin-bottom: 0.5rem; text-align: left;">${d.label}</h4>
                                                <div style="font-size: 0.85rem; color: #ccc; text-align: left; line-height: 1.4;">
                                                    ${officesHtml}
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                    // Pin click to toggle card
                                    const pin = el.querySelector('.globe-pin');
                                    const card = el.querySelector('.globe-hover-card');
                                    const closeBtn = el.querySelector('.globe-card-close');

                                    pin.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        // Close all other open cards
                                        document.querySelectorAll('.globe-hover-card.globe-card-visible').forEach(c => {
                                            if (c !== card) c.classList.remove('globe-card-visible');
                                        });
                                        // Toggle this card
                                        card.classList.toggle('globe-card-visible');
                                    });

                                    closeBtn.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        card.classList.remove('globe-card-visible');
                                    });

                                    // Fade in the pulse after pin drops
                                    setTimeout(() => {
                                        const pulse = el.querySelector('.globe-pulse');
                                        if (pulse) pulse.style.opacity = '1';
                                    }, 800 + (markerData.indexOf(d) * 150));

                                    el.style.transform = 'translate(-50%, -50%)';
                                    return el;
                                });
                        }, 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            globeObserver.observe(globeSection);
        }

        // Auto-rotate
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = 0.8;
        world.controls().enableZoom = false;

        // Initial viewport focus
        world.pointOfView({ lat: 20, lng: 40, altitude: 5 });
    }

    // Products Crate Box Interaction
    const productCrates = document.querySelectorAll('.product-crate');
    productCrates.forEach(crate => {
        const lid = crate.querySelector('.crate-lid');
        if (!lid) return;

        lid.addEventListener('click', function (e) {
            if (crate.classList.contains('open')) return;

            // First, close any currently open crate
            const currentlyOpen = document.querySelector('.product-crate.open');
            if (currentlyOpen && currentlyOpen !== crate) {
                currentlyOpen.classList.remove('open');
                const openLid = currentlyOpen.querySelector('.crate-lid');
                if (openLid) {
                    openLid.classList.remove('pried-open');
                }
                // Restore lock icon
                const oldLock = currentlyOpen.querySelector('.lock-icon');
                if (oldLock) oldLock.textContent = '🔒';
            }

            // Smooth open — no shake
            lid.classList.add('pried-open');
            crate.classList.add('open');

            // Swap lock icon to unlocked
            const lockIcon = lid.querySelector('.lock-icon');
            if (lockIcon) lockIcon.textContent = '🔓';

            if (window.playSnapSound) window.playSnapSound();
        });
    });

    // Testimonial Envelope Interaction
    const envelopes = document.querySelectorAll('.envelope-card');
    envelopes.forEach(envelope => {
        envelope.addEventListener('click', function () {
            if (this.classList.contains('is-open')) {
                this.classList.remove('is-open');
                const hint = this.querySelector('.envelope-hint');
                if (hint) hint.textContent = 'Click to Open';
            } else {
                envelopes.forEach(e => {
                    e.classList.remove('is-open');
                    const h = e.querySelector('.envelope-hint');
                    if (h) h.textContent = 'Click to Open';
                });

                this.classList.add('is-open');
                const hint = this.querySelector('.envelope-hint');
                if (hint) hint.textContent = 'Click to Close';
            }
        });
    });

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

    // Stats Reveal on Scroll
    const statCards = document.querySelectorAll('.lego-flip');

    // Stats Lego Stack Reveal
    const statBricks = document.querySelectorAll('.stat-brick');

    // Easing function: easeOutQuart
    const easeOutQuart = x => 1 - Math.pow(1 - x, 4);

    const animateCountUp = (el, target) => {
        const duration = 1000; // 1 second as requested
        let startTime = null;

        const countUpStep = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const progressRatio = Math.min(progress / duration, 1);

            const current = Math.floor(target * easeOutQuart(progressRatio));
            el.innerText = current;

            if (progressRatio < 1) {
                window.requestAnimationFrame(countUpStep);
            } else {
                el.innerText = target;
            }
        };

        window.requestAnimationFrame(countUpStep);
    };

    if (statBricks.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stack = document.getElementById('stats-lego-stack');
                    if (stack) {
                        statBricks.forEach(brick => {
                            const delay = parseInt(brick.getAttribute('data-delay') || '0');
                            brick.style.setProperty('--drop-delay', delay);

                            setTimeout(() => {
                                brick.classList.add('dropped');
                                if (window.playSnapSound) window.playSnapSound();

                                const countEl = brick.querySelector('.count-up');
                                const targetVal = parseInt(brick.getAttribute('data-target') || '0');
                                if (countEl) {
                                    animateCountUp(countEl, targetVal);
                                }
                            }, delay);
                        });
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.getElementById('stats');
        if (statsSection) statsObserver.observe(statsSection);
    }
});
