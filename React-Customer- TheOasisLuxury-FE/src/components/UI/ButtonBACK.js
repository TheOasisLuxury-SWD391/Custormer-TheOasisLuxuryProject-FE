import React from 'react';

const BackButton = () => {
    const goBack = () => {
        // Sử dụng window.history để quay lại trang trước
        window.history.back();
    };

    return (
        <button 
            className="bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-2 px-4 rounded float-right"
            onClick={goBack}
        >
            Back
        </button>
    );
};

export default BackButton;
