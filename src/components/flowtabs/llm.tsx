import e from "express";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
type LLMProps = {
  onLLMSelected: (
    llm: string | null,
    temperature: string,
    isVerbose: boolean,
    apiKey: string
  ) => void,

  currentllm:string | null,
  currenttemp: string | null,
  currentVerbose : boolean | null,
};

export default function LLMs({ onLLMSelected,currentllm,currenttemp,currentVerbose }: LLMProps) {
  const options = ["Groq", "Gemini", "OpenAI","Groq-Vision"];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [dropdownData, setDropdownData] = useState({
    apiKey: "",
    temperature: "0",
    isVerbose: false,
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const allProps = [currentllm,currenttemp,currentVerbose].every((value) => value!==null)

    if(allProps) {
      setSelectedOption(currentllm)
      setDropdownData({
        apiKey: "",
        temperature: currenttemp as string,
        isVerbose: currentVerbose as boolean
      })
    }
  },[currentllm,currenttemp,currentVerbose])

  const handleRadioChange = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    setDropdownData((prev) => ({
      ...prev,
      [target.name]:
        target.type === "checkbox"
          ? (target as HTMLInputElement).checked
          : target.value,
    }));
  };

  const handleConfirm = () => {
    if (selectedOption) {
      // Pass the LLM selection and configuration to the parent component
      onLLMSelected(
        selectedOption,
        dropdownData.temperature,
        dropdownData.isVerbose,
        dropdownData.apiKey
      );
    }
    setShowDropdown(false); // Hide dropdown after confirmation
    console.log("Confirmed data:", {
      llm: selectedOption,
      ...dropdownData,
    });
  };
  return (
    <div className="h-full">
      <div className="flex flex-col space-y-3">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="radio"
              name="selection"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleRadioChange(option)}
              className="w-5 h-5 border border-indigo-500 checked:bg-indigo-800 checked:hover:bg-indigo-500 checked:active:bg-indigo-500 checked:focus:bg-indigo-500 focus:bg-indigo-500 focus:ring-indigo-500"
            />
            {option}
          </label>
        ))}
      </div>

      {showDropdown && (
        <div className="mt-4 border-2 p-4 rounded-md ">
          <h2 className="font-semibold mb-2">Configure {selectedOption}</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block font-medium mb-1">API Key</label>
              <input
                type="text"
                name="apiKey"
                value={dropdownData.apiKey}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Enter API Key"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Temperature</label>
              <input
                type="text"
                name="temperature"
                value={dropdownData.temperature}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Set Temperature"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isVerbose"
                checked={dropdownData.isVerbose}
                onChange={handleInputChange}
                className="active:bg-indigo-500 focus:ring-indigo-600"
              />
              <label className="font-medium ">Is Verbose</label>
            </div>
            <button
              onClick={handleConfirm}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400 "
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
