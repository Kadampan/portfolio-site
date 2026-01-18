'use client';

import { useState } from 'react';
import styles from './SettingsSection.module.css';

export default function SettingsSection() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        if (newPassword === currentPassword) {
            setMessage({ type: 'error', text: 'New password must be different from current password' });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                // Clear form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');

                // Optionally logout user after password change
                setTimeout(() => {
                    if (confirm('Password changed! You will be logged out. Click OK to continue.')) {
                        localStorage.removeItem('adminToken');
                        window.location.href = '/admin/login';
                    }
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const levels = [
            { strength: 0, label: '', color: '' },
            { strength: 1, label: 'Weak', color: '#ff4444' },
            { strength: 2, label: 'Fair', color: '#ffaa00' },
            { strength: 3, label: 'Good', color: '#44aaff' },
            { strength: 4, label: 'Strong', color: '#44ff44' },
            { strength: 5, label: 'Very Strong', color: '#00ff88' }
        ];

        return levels[strength];
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className={styles.settingsSection}>
            <div className={styles.header}>
                <h2>Security Settings</h2>
                <p>Change your admin dashboard password</p>
            </div>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    <span className={styles.messageIcon}>
                        {message.type === 'success' ? '✓' : '⚠'}
                    </span>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="currentPassword">
                        Current Password <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.passwordInput}>
                        <input
                            type={showPasswords.current ? 'text' : 'password'}
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className={styles.toggleBtn}
                            aria-label="Toggle password visibility"
                        >
                            {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="newPassword">
                        New Password <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.passwordInput}>
                        <input
                            type={showPasswords.new ? 'text' : 'password'}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password (min 6 characters)"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className={styles.toggleBtn}
                            aria-label="Toggle password visibility"
                        >
                            {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {newPassword && (
                        <div className={styles.strengthMeter}>
                            <div className={styles.strengthBar}>
                                <div
                                    className={styles.strengthFill}
                                    style={{
                                        width: `${(passwordStrength.strength / 5) * 100}%`,
                                        backgroundColor: passwordStrength.color
                                    }}
                                />
                            </div>
                            <span
                                className={styles.strengthLabel}
                                style={{ color: passwordStrength.color }}
                            >
                                {passwordStrength.label}
                            </span>
                        </div>
                    )}
                    <div className={styles.passwordHints}>
                        <p>Password should contain:</p>
                        <ul>
                            <li className={newPassword.length >= 6 ? styles.met : ''}>
                                At least 6 characters
                            </li>
                            <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? styles.met : ''}>
                                Uppercase and lowercase letters
                            </li>
                            <li className={/\d/.test(newPassword) ? styles.met : ''}>
                                At least one number
                            </li>
                            <li className={/[^a-zA-Z0-9]/.test(newPassword) ? styles.met : ''}>
                                Special character (recommended)
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">
                        Confirm New Password <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.passwordInput}>
                        <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className={styles.toggleBtn}
                            aria-label="Toggle password visibility"
                        >
                            {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                        <span className={styles.errorHint}>Passwords do not match</span>
                    )}
                    {confirmPassword && newPassword === confirmPassword && (
                        <span className={styles.successHint}>✓ Passwords match</span>
                    )}
                </div>

                <div className={styles.formActions}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                    >
                        {loading ? (
                            <>
                                <span className={styles.spinner}></span>
                                Changing Password...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                </div>
            </form>

            <div className={styles.securityTips}>
                <h3>🔒 Security Tips</h3>
                <ul>
                    <li>Use a strong, unique password for your admin account</li>
                    <li>Consider using a password manager</li>
                    <li>Change your password regularly</li>
                    <li>Never share your admin credentials</li>
                    <li>Always logout when finished</li>
                </ul>
            </div>
        </div>
    );
}
