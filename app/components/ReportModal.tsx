"use client";
import { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSubmit = () => {
    // Handle the submit action (e.g., send the report data to a server or log it)
    console.log(`Reported issue: ${selectedOption}`);
    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black p-5 rounded-2xl shadow-lg max-w-md w-[250px]">
        <h2 className="text-lg font-semibold mb-4">Report Issue</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-lg">Select Issue:</label>
          <div className="space-y-2">
            <label className="flex items-center text-base">
              <input
                type="radio"
                value="Question is wrong"
                checked={selectedOption === "Question is wrong"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Question is wrong
            </label>
            <label className="flex items-center text-base">
              <input
                type="radio"
                value="Answer is wrong"
                checked={selectedOption === "Answer is wrong"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Answer is wrong
            </label>
            <label className="flex items-center text-base">
              <input
                type="radio"
                value="Spelling mistake"
                checked={selectedOption === "Spelling mistake"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Spelling mistake
            </label>
            <label className="flex items-center text-base">
              <input
                type="radio"
                value="Subject different"
                checked={selectedOption === "Subject different"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Subject different
            </label>
            <label className="flex items-center text-base">
              <input
                type="radio"
                value="Other"
                checked={selectedOption === "Other"}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mr-2"
              />
              Other
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="text-sm text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="text-sm text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
