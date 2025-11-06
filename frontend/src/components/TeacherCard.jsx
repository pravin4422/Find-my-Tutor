import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import StarRating from './StarRating';

const TeacherCard = ({ teacher }) => {
    const defaultIcon = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
            {/* Profile Picture with Status Indicator */}
            <div className="relative w-28 h-28 mx-auto mb-6">
                <img 
                    src={getImageUrl(teacher.profilePicture) || defaultIcon} 
                    alt={teacher.name} 
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:border-blue-200 transition-all duration-300" 
                    onError={(e) => {
                        e.target.src = defaultIcon;
                    }}
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {/* Teacher Info */}
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {teacher.name}
                </h3>
                
                {/* Subjects Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {teacher.teacherProfile?.subjects?.slice(0, 3).map((subject, index) => (
                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium">
                            {subject}
                        </span>
                    )) || (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                            No subjects listed
                        </span>
                    )}
                    {teacher.teacherProfile?.subjects?.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                            +{teacher.teacherProfile.subjects.length - 3} more
                        </span>
                    )}
                </div>

                {/* Rating and Reviews */}
                <div className="flex justify-center items-center mb-2">
                    <StarRating 
                        rating={teacher.teacherProfile?.averageRating || 0} 
                        showNumber={true}
                    />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    {teacher.teacherProfile?.totalReviews || 0} reviews • {teacher.teacherProfile?.experience || 0} years exp.
                </p>

                {/* Location */}
                {teacher.location?.city && (
                    <div className="flex items-center justify-center text-gray-500 text-sm mb-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {teacher.location.city}, {teacher.location.state}
                    </div>
                )}
            </div>

            {/* Enhanced CTA Button */}
            <Link 
                to={`/teacher/${teacher._id}`} 
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md group-hover:shadow-lg"
            >
                <span className="flex items-center justify-center">
                    View Profile
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </Link>
        </div>
    );
};
export default TeacherCard;
