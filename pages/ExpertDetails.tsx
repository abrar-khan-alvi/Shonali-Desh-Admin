import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ref, onValue, off, update } from 'firebase/database';
import { database } from '../firebase';
import { Expert, ConsultRequest, Consultation, ExpertVerificationStatus } from '../types';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Briefcase,
    Award,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    Star,
    ShieldCheck,
    Send
} from 'lucide-react';

const ExpertDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [expert, setExpert] = useState<Expert | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<ExpertVerificationStatus | ''>('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!id) return;

        const expertRef = ref(database, `Experts/${id}`);

        const unsubscribe = onValue(
            expertRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setExpert({ id, ...data } as Expert);
                    setError(null);
                } else {
                    setError('Expert not found');
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching expert:', error);
                setError('Failed to load expert data');
                setLoading(false);
            }
        );

        return () => off(expertRef, 'value', unsubscribe);
    }, [id]);

    useEffect(() => {
        if (expert) {
            setSelectedStatus(expert.verificationStatus);
        }
    }, [expert]);

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleUpdateStatus = async () => {
        if (!expert || !selectedStatus) return;

        setIsUpdating(true);
        try {
            const updates: any = {
                verificationStatus: selectedStatus
            };

            let generatedPassword = '';
            if (selectedStatus === ExpertVerificationStatus.Verified && expert.verificationStatus !== ExpertVerificationStatus.Verified) {
                generatedPassword = generatePassword();
                updates.password = generatedPassword; // Storing in plain text as requested
                updates.hasAvailable = true;
            }

            // 1. Update Firebase first
            await update(ref(database, `Experts/${id}`), updates);
            console.log('Firebase updated successfully');

            // 2. If verified, send email
            if (generatedPassword) {
                if (!expert.email) {
                    alert(`Status updated to Verified. Password generated: ${generatedPassword}. BUT Email NOT sent because expert has no email address.`);
                } else {
                    const SERVICE_ID = 'service_5x4bm17';
                    const TEMPLATE_ID = 'template_pf6xo4m';
                    const PUBLIC_KEY = 'q2yKc_DIR2YJFyWEi';

                    // Initialize EmailJS
                    emailjs.init(PUBLIC_KEY);

                    const templateParams = {
                        to_name: expert.name,
                        to_email: expert.email,
                        email: expert.email, // Adding fallback
                        password: generatedPassword,
                        login_url: 'https://expert.shonalidesh.com/login'
                    };

                    console.log('Attempting to send email with params:', templateParams);

                    try {
                        // Using 3 args as per user's working snippet
                        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
                        console.log('Email sent successfully!', response.status, response.text);
                        alert(`Status updated to Verified. Password generated: ${generatedPassword}. Email sent successfully.`);
                    } catch (emailError: any) {
                        console.error('FAILED to send email:', emailError);
                        alert(`Status updated to Verified, BUT Email failed to send. Error: ${JSON.stringify(emailError)}`);
                    }
                }
            } else {
                alert(`Status updated to ${selectedStatus}`);
            }

        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status in database');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading expert details...</p>
                </div>
            </div>
        );
    }

    if (error || !expert) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800">{error || 'Expert not found'}</p>
                <button
                    onClick={() => navigate('/experts')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    ← Back to Experts
                </button>
            </div>
        );
    }

    const consultRequests: ConsultRequest[] = expert.consultRequests
        ? Object.entries(expert.consultRequests).map(([id, req]) => ({
            id,
            ...(req as Omit<ConsultRequest, 'id'>)
        } as ConsultRequest))
        : [];
    const consultations: Consultation[] = expert.consultations
        ? Object.entries(expert.consultations).map(([id, cons]) => ({
            id,
            ...(cons as Omit<Consultation, 'id'>)
        } as Consultation))
        : [];

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            verified: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            accepted: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/experts')}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Experts
                </button>
            </div>

            {/* Expert Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-4">
                        <div className="relative">
                            {expert.profilePhotoUrl ? (
                                <img
                                    src={expert.profilePhotoUrl}
                                    alt={expert.name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-4xl text-gray-500">{expert.name.charAt(0)}</span>
                                </div>
                            )}
                            <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${expert.hasAvailable ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{expert.name}</h1>
                                    <p className="text-gray-600 mt-1">
                                        {expert.areasOfSpecialization?.join(', ') || 'Expert'}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(expert.verificationStatus)}`}>
                                    {expert.verificationStatus.charAt(0).toUpperCase() + expert.verificationStatus.slice(1)}
                                </span>
                            </div>
                            {expert.metadata?.ratingAvg && (
                                <div className="flex items-center mt-2">
                                    <Star size={20} fill="#FCD34D" className="text-yellow-400" />
                                    <span className="ml-1 font-semibold text-gray-900">{expert.metadata.ratingAvg.toFixed(1)}</span>
                                    <span className="ml-1 text-gray-500">({consultations.length} consultations)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {expert.bio && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{expert.bio}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Action Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <ShieldCheck size={20} className="mr-2 text-blue-600" />
                    Verification Actions
                </h2>
                <div className="flex flex-col md:flex-row items-end gap-4">
                    <div className="w-full md:w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as ExpertVerificationStatus)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={ExpertVerificationStatus.Pending}>Pending</option>
                            <option value={ExpertVerificationStatus.Verified}>Verified</option>
                            <option value={ExpertVerificationStatus.Rejected}>Rejected</option>
                        </select>
                    </div>
                    <button
                        onClick={handleUpdateStatus}
                        disabled={isUpdating || selectedStatus === expert.verificationStatus}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUpdating ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                            <Send size={16} className="mr-2" />
                        )}
                        Update & Notify
                    </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    Updating to <strong>Verified</strong> will automatically generate a password and prompt to send an email to the expert.
                </p>
            </div>

            {/* Contact & Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Phone size={18} className="text-gray-400 mr-3" />
                            <span className="text-gray-700">{expert.phone}</span>
                        </div>
                        {expert.email && (
                            <div className="flex items-center">
                                <Mail size={18} className="text-gray-400 mr-3" />
                                <span className="text-gray-700">{expert.email}</span>
                            </div>
                        )}
                        {expert.paymentPerReport && (
                            <div className="flex items-center">
                                <DollarSign size={18} className="text-gray-400 mr-3" />
                                <span className="text-gray-700">৳{expert.paymentPerReport} per report</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Location</h2>
                    <div className="flex items-start">
                        <MapPin size={18} className="text-gray-400 mr-3 mt-1" />
                        <div className="text-gray-700">
                            <p>{expert.locationInfo.village}</p>
                            <p>{expert.locationInfo.upazila}, {expert.locationInfo.district}</p>
                            <p>{expert.locationInfo.region}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Qualifications & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <GraduationCap size={20} className="mr-2" />
                        Education
                    </h2>
                    <p className="text-gray-700">{expert.educationalQualification || 'Not specified'}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Briefcase size={20} className="mr-2" />
                        Current Affiliation
                    </h2>
                    <p className="text-gray-700">{expert.currentAffiliation || 'Not specified'}</p>
                    {expert.yearsOfExperience && (
                        <p className="text-sm text-gray-500 mt-2">{expert.yearsOfExperience} years of experience</p>
                    )}
                </div>
            </div>

            {/* Specializations */}
            {expert.areasOfSpecialization && expert.areasOfSpecialization.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Award size={20} className="mr-2" />
                        Areas of Specialization
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {expert.areasOfSpecialization.map((area, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                {area}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Credentials */}
            {expert.credentials && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Credentials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {expert.credentials.degreeCertificateUrl && (
                            <div className="border rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-600 mb-3">Degree Certificate</label>
                                <div className="relative group">
                                    <img
                                        src={expert.credentials.degreeCertificateUrl}
                                        alt="Degree Certificate"
                                        className="w-full h-48 object-cover rounded-md border border-gray-200"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <a
                                            href={expert.credentials.degreeCertificateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-100"
                                        >
                                            View Full Size
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                        {expert.credentials.professionalIdUrl && (
                            <div className="border rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-600 mb-3">Professional ID</label>
                                <div className="relative group">
                                    <img
                                        src={expert.credentials.professionalIdUrl}
                                        alt="Professional ID"
                                        className="w-full h-48 object-cover rounded-md border border-gray-200"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <a
                                            href={expert.credentials.professionalIdUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-100"
                                        >
                                            View Full Size
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Consult Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Consult Requests ({consultRequests.length})</h2>
                </div>
                {consultRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-sm text-gray-600">
                                    <th className="p-4 font-semibold">Farmer ID</th>
                                    <th className="p-4 font-semibold">Hazard Type</th>
                                    <th className="p-4 font-semibold">Problem</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {consultRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-700">{req.farmerId}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                                                {req.hazardType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 max-w-xs truncate">{req.shortProblem}</td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">No consult requests</div>
                )}
            </div>

            {/* Consultations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Consultations ({consultations.length})</h2>
                </div>
                {consultations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-sm text-gray-600">
                                    <th className="p-4 font-semibold">Farmer ID</th>
                                    <th className="p-4 font-semibold">Channel</th>
                                    <th className="p-4 font-semibold">Summary</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold">Rating</th>
                                    <th className="p-4 font-semibold">Payment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {consultations.map((cons) => (
                                    <tr key={cons.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-700">{cons.farmerId}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                                {cons.channel}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 max-w-xs truncate">
                                            {cons.reportSummary || 'No summary'}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(cons.consultedAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            {cons.farmerRating ? (
                                                <div className="flex items-center">
                                                    <Star size={14} fill="#FCD34D" className="text-yellow-400 mr-1" />
                                                    <span className="text-sm font-medium">{cons.farmerRating}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {cons.payment && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cons.payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    ৳{cons.payment.amount} - {cons.payment.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">No consultations yet</div>
                )}
            </div>
        </div>
    );
};

export default ExpertDetails;