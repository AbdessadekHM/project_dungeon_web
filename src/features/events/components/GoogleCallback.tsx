import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { calendarApi } from '../api/calendarApi';
import { Loader2 } from 'lucide-react';

export const GoogleCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');

    useEffect(() => {
        const handleCallback = async () => {
            const codeVerifier = sessionStorage.getItem('google_code_verifier') || '';

            if (code) {
                try {
                    await calendarApi.exchangeGoogleCode(code, codeVerifier);
                    sessionStorage.removeItem('google_code_verifier'); // Clean up
                    navigate('/dashboard/events');
                } catch (error) {
                    console.error('Failed to exchange code:', error);
                    navigate('/dashboard');
                }
            } else {
                navigate('/dashboard');
            }
        };

        handleCallback();
    }, [code, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium">Connecting to Google Calendar...</p>
        </div>
    );
};
