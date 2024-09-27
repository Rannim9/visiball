import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams

const ResetPassword = () => {
    const { id } = useParams(); // Get the token from the URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit comporter au moins 6 caractères.');
            return;
        }

        setError('');

        try {
            const response = await fetch('http://localhost:3000/contactmsyt/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: id, newPassword: password }), // Include the token (id) and password
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Mot de passe réinitialisé avec succès !');
            } else {
                setError(data.message || 'Erreur lors de la réinitialisation du mot de passe.');
            }
        } catch (err) {
            setError('Une erreur s\'est produite lors de la demande.');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="text-center">Réinitialiser le mot de passe</h3>
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-group mb-3">
                    <label htmlFor="password">Nouveau mot de passe</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Entrer un nouveau mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirmer le nouveau mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                    Réinitialiser le mot de passe
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
