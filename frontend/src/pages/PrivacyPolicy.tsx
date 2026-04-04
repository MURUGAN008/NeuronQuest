import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <main className="min-h-screen flex justify-center px-6 py-20 bg-transparent">
            <SEO
                title="Privacy Policy | CortexPlay – Free Brain Training Games"
                description="Read CortexPlay's privacy policy. Learn how we handle your data, cookies, and third-party services on our free brain training games platform."
                url="https://cortexplay.games/privacy-policy"
                keywords="CortexPlay privacy policy, brain games privacy, data protection"
            />
            <article className="max-w-3xl w-full">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gradient-cyan neon-text-cyan drop-shadow-lg">
                    Privacy Policy
                </h1>
                <p className="text-slate-400 mb-10 text-sm">Last updated: April 4, 2026</p>

                <div className="space-y-10 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">1. Introduction</h2>
                        <p>
                            Welcome to CortexPlay (<a href="https://cortexplay.games" className="text-cyan-400 hover:underline">cortexplay.games</a>). 
                            We are committed to protecting your privacy and being transparent about how we handle information. 
                            This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data. 
                            By using CortexPlay, you agree to the practices described in this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">2. Information We Collect</h2>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-2">2.1 Information You Provide</h3>
                        <p className="mb-4">
                            CortexPlay does not require you to create an account, register, or provide any personal information to use our games. 
                            If you contact us via email, we will collect the information you voluntarily provide, such as your name and email address, 
                            solely for the purpose of responding to your inquiry.
                        </p>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-2">2.2 Automatically Collected Information</h3>
                        <p className="mb-4">
                            When you visit CortexPlay, certain information is collected automatically by our hosting and analytics providers:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                            <li><strong className="text-slate-300">Usage Analytics:</strong> We use Vercel Analytics and Vercel Speed Insights to understand how visitors interact with our site. This includes page views, load times, and general usage patterns. This data is aggregated and anonymized.</li>
                            <li><strong className="text-slate-300">Device Information:</strong> Browser type, operating system, screen resolution, and language preferences may be collected to optimize the user experience.</li>
                            <li><strong className="text-slate-300">IP Address:</strong> Your IP address may be temporarily processed by our hosting provider (Vercel) and advertising partners for security and fraud prevention purposes.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-cyan-400 mb-2 mt-4">2.3 Local Storage</h3>
                        <p>
                            CortexPlay stores your game progress, high scores, and sound preferences locally on your device using your browser's localStorage. 
                            This data never leaves your device and is not transmitted to our servers or any third party. 
                            You can clear this data at any time through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">3. Cookies and Advertising</h2>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-2">3.1 Google AdSense</h3>
                        <p className="mb-4">
                            We use Google AdSense to display advertisements on our site. Google AdSense may use cookies and web beacons to serve ads based on 
                            your prior visits to CortexPlay or other websites. Google's use of advertising cookies enables it and its partners to serve ads 
                            based on your visit to our site and/or other sites on the Internet.
                        </p>
                        <p className="mb-4">
                            You may opt out of personalized advertising by visiting{' '}
                            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                Google Ads Settings
                            </a>. Alternatively, you can opt out of third-party vendor cookies by visiting{' '}
                            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                www.aboutads.info/choices
                            </a>.
                        </p>

                        <h3 className="text-lg font-semibold text-cyan-400 mb-2">3.2 Essential Cookies</h3>
                        <p>
                            Beyond advertising cookies set by Google, CortexPlay itself does not set any cookies. We use browser localStorage 
                            (not cookies) to save your game progress and preferences.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">4. How We Use Information</h2>
                        <p className="mb-3">The information described above is used for the following purposes:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                            <li>To provide and maintain our brain training games</li>
                            <li>To analyze site usage and improve performance</li>
                            <li>To display relevant advertisements through Google AdSense</li>
                            <li>To respond to your inquiries or feedback</li>
                            <li>To detect, prevent, and address technical issues or abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">5. Third-Party Services</h2>
                        <p className="mb-3">CortexPlay uses the following third-party services:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                            <li><strong className="text-slate-300">Vercel:</strong> Website hosting, analytics, and speed insights (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Vercel Privacy Policy</a>)</li>
                            <li><strong className="text-slate-300">Google AdSense:</strong> Advertising services (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google Privacy Policy</a>)</li>
                            <li><strong className="text-slate-300">Google Fonts:</strong> Web font delivery (no cookies; fonts are cached by your browser)</li>
                        </ul>
                        <p className="mt-3">
                            Each of these services has its own privacy policy governing the data they collect. We encourage you to review their policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">6. Children's Privacy</h2>
                        <p>
                            CortexPlay is designed for a general audience. We do not knowingly collect personal information from children under the age of 13. 
                            Our games do not require registration or the submission of any personal data. If you are a parent or guardian and believe your child 
                            has provided personal information to us, please contact us at the email address below, and we will take steps to remove that information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">7. Data Security</h2>
                        <p>
                            We take the security of your data seriously. CortexPlay is served over HTTPS to ensure secure data transmission. 
                            Since we do not collect or store personal data on our servers, the risk of data breaches affecting your personal information is minimal. 
                            Game data stored in your browser's localStorage is protected by your browser's built-in security mechanisms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">8. Your Rights</h2>
                        <p className="mb-3">Depending on your jurisdiction, you may have the following rights:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                            <li>The right to access information we hold about you</li>
                            <li>The right to request deletion of your data</li>
                            <li>The right to opt out of personalized advertising</li>
                            <li>The right to lodge a complaint with a data protection authority</li>
                        </ul>
                        <p className="mt-3">
                            Since CortexPlay stores game data only in your browser's localStorage, you have full control over this data and 
                            can delete it at any time through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">9. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated 
                            "Last updated" date. We encourage you to review this policy periodically. Your continued use of CortexPlay after 
                            changes are posted constitutes your acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-100 mb-3">10. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this Privacy Policy, please contact us at:{' '}
                            <a href="mailto:murs4002@gmail.com" className="text-cyan-400 hover:underline font-medium">
                                murs4002@gmail.com
                            </a>
                        </p>
                    </section>
                </div>

                {/* Back link */}
                <div className="mt-12 pt-8 border-t border-slate-800/50">
                    <a href="/" className="text-cyan-400 hover:underline font-medium text-sm">← Back to CortexPlay</a>
                </div>
            </article>
        </main>
    );
};

export default PrivacyPolicy;
