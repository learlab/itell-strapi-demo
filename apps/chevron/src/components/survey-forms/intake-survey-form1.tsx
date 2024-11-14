'use client'

import React, { useState } from "react";
import { Button } from "@itell/ui/button"

interface SurveyData {
  age: string;
  gender: string;
  education: string;
  ethnicity: string;
  occupation: string;
}

const SurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<SurveyData>({
    age: "",
    gender: "",
    education: "",
    ethnicity: "",
    occupation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Survey Data Submitted:", formData);
    // Handle data submission (e.g., send to API endpoint)
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-6 p-4 shadow-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Education Level:</label>
        <select
          name="education"
          value={formData.education}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Education Level</option>
          <option value="no high-school">Not completed high school</option>
          <option value="high-school">High School</option>
          <option value="associate">Associate's Degree</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="master">Master's Degree</option>
          <option value="doctorate">Doctorate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ethnicity:</label>
        <input
          type="text"
          name="ethnicity"
          value={formData.ethnicity}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Occupation:</label>
        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <Button
        type="submit"
        className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit Survey
      </Button>
    </form>
  );
};

export default SurveyForm;