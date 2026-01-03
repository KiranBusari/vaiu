"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // In a real application, you would send this to an API endpoint
            console.log("Form submitted:", formData);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSubmitStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Have a question or feedback? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Contact Info Cards */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Email
                        </h3>
                        <a
                            href="mailto:contact@vaiu.com"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                            contact@vaiu.com
                        </a>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            GitHub
                        </h3>
                        <a
                            href="https://github.com/KiranBusari/vaiu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            KiranBusari/vaiu
                        </a>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Response Time
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Within 24 hours
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                            >
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="What is this about?"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                            >
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Your message..."
                            />
                        </div>

                        {submitStatus === "success" && (
                            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
                                ✓ Thank you for your message! We&apos;ll get back to you soon.
                            </div>
                        )}

                        {submitStatus === "error" && (
                            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
                                ✗ An error occurred. Please try again.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                            For more information, please visit our{" "}
                            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Privacy Policy
                            </Link>
                            {" "}or{" "}
                            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Terms of Service
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
