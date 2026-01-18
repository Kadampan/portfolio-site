'use client';

import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact({ data }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    console.log('Contact component data:', data);

    if (!data) {
        console.log('No contact data - returning null');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    to: data.recipientEmail || data.email
                })
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('✓ Message sent successfully! I\'ll get back to you soon.');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('✗ Failed to send message. Please try emailing me directly.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('✗ An error occurred. Please try emailing me directly at ' + (data.email || ''));
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 5000);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section id="contact" className="section" style={{ background: 'var(--color-bg-secondary)', padding: '80px 0' }}>
            <div className="container">
                <h2 className="section-title">
                    <span className="gradient-text">Get In Touch</span>
                </h2>

                <p className={styles.subtitle}>
                    Have a project in mind or just want to say hello? Feel free to reach out!
                </p>

                <div className={styles.content}>
                    <div className={styles.contactInfo}>
                        <div className={styles.infoCard}>
                            <span className={styles.icon}>📧</span>
                            <div>
                                <h4>Email</h4>
                                <a href={`mailto:${data.email}`}>{data.email}</a>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <span className={styles.icon}>📱</span>
                            <div>
                                <h4>Phone</h4>
                                <a href={`tel:${data.phone}`}>{data.phone}</a>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <span className={styles.icon}>📍</span>
                            <div>
                                <h4>Location</h4>
                                <p>{data.location}</p>
                            </div>
                        </div>

                        <div className={styles.socialLinks}>
                            <h4>Follow Me</h4>
                            <div className={styles.links}>
                                {data.linkedin && (
                                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                        LinkedIn
                                    </a>
                                )}
                                {data.github && (
                                    <a href={data.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                        GitHub
                                    </a>
                                )}
                                {data.artstation && (
                                    <a href={data.artstation} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                        ArtStation
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <form className={`${styles.form} glass`} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        {status && <div className={styles.status}>{status}</div>}

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
