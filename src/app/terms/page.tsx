export const metadata = {
    title: "Terms of Service | Vaiu",
    description: "Terms of Service for Vaiu",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                    Terms of Service
                </h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                    <p className="text-lg">
                        Last updated: January 3, 2026
                    </p>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            1. Agreement to Terms
                        </h2>
                        <p>
                            By accessing and using Vaiu, you agree to be bound by these Terms of Service. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            2. Use License
                        </h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on Vaiu for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Modifying or copying the materials</li>
                            <li>Using the materials for any commercial purpose or for any public display</li>
                            <li>Attempting to decompile or reverse engineer any software contained on Vaiu</li>
                            <li>Removing any copyright or other proprietary notations from the materials</li>
                            <li>Transferring the materials to another person or &quot;mirroring&quot; the materials on any other server</li>
                            <li>Violating any applicable laws or regulations</li>
                            <li>Disrupting the normal flow of dialogue within our website</li>
                            <li>Harassing or causing distress or inconvenience to any person</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            3. Disclaimer
                        </h2>
                        <p>
                            The materials on Vaiu are provided on an &apos;as is&apos; basis. Vaiu makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            4. Limitations
                        </h2>
                        <p>
                            In no event shall Vaiu or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Vaiu, even if Vaiu or an authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            5. Accuracy of Materials
                        </h2>
                        <p>
                            The materials appearing on Vaiu could include technical, typographical, or photographic errors. Vaiu does not warrant that any of the materials on Vaiu is accurate, complete, or current. Vaiu may make changes to the materials contained on its website at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            6. Links
                        </h2>
                        <p>
                            Vaiu has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Vaiu of the site. Use of any such linked website is at the user&apos;s own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            7. Modifications
                        </h2>
                        <p>
                            Vaiu may revise these Terms of Service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            8. Governing Law
                        </h2>
                        <p>
                            These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which Vaiu operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                            9. Contact Information
                        </h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us at{" "}
                            <a href="mailto:contact@vaiu.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                                contact@vaiu.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
