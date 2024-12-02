"use client";

import React, { useState } from "react";
import { publicIp, publicIpv4, publicIpv6 } from "public-ip";


const AddPost = () => {
  const [topic, setTopic] = useState(""); // Topic
  const [description, setDescription] = useState(""); // Post description
  const [category, setCategory] = useState(""); // Selected category
  const [image, setImage] = useState(null); // For uploaded or selected images
  const [prompt, setPrompt] = useState(""); // AI prompt
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [previewImage, setPreviewImage] = useState(null); // Preview of AI-generated image
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Heading
  const TopBar = () => {
    return (
      <div className="bg-yellow-400 text-black py-3 text-center shadow-md rounded-lg mb-8">
        <h1 className="text-2xl font-bold">Create Post</h1>
      </div>
    );
  };

  // Handle AI image generation
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setPreviewImage(null);

    try {
      // Mock API call
      const ip = await publicIpv4();
      const response = await fetch(`http://${ip}:3001/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const data = await response.json();

        // Get the image URL from the response (assuming it's in 'data.links')
        const imageUrl = data.links;  // Assuming 'links' is the S3 URL

      setPreviewImage(imageUrl); // Display the generated image in the modal
    } catch (error) {
      console.error(error);
      alert("Error generating image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Add previewed image to the image box
  const addImageToBox = () => {
    setImage(previewImage);
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic || !description.trim() || !category || !image) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    // Submit the form data
    console.log({
      topic,
      description,
      category,
      image,
    });
    alert("Post submitted successfully!");
    setTopic("");
    setDescription("");
    setCategory("");
    setImage(null);
    setPrompt("");
  };

  return (
    <div className="h-screen w-screen p-4 flex flex-col">
          <TopBar />
      {/* Image box */}
      <div className="flex justify-center items-center bg-yellow-100 text-black py-3 shadow-md rounded-lg mb-8 p-8">
        {/* Image Preview */}
        <div className="w-full sm:w-1/2 lg:w-1/4 p-2 border border-gray-300 rounded-md flex justify-center items-center">
          {image ? (
            <img
              src={image}
              alt="Selected"
              className="w-full h-auto rounded shadow-md"
            />
          ) : (
            <div className="text-gray-500 text-center p-4">No Image Selected</div>
          )}
        </div>

        {/* Buttons */}
        <div className="ml-4 flex flex-col gap-2 justify-center items-center">
          <button
            onClick={() => document.getElementById("imageUpload").click()}
            className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded w-full"
          >
            Upload Image
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Generate Image using AI
          </button>
        </div>

        {/* Hidden file input for image upload */}
        <input
          type="file"
          accept="image/*"
          id="imageUpload"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>


      {/* Modal for AI image generation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md sm:w-1/2 lg:w-1/3">
          <h2 className="text-lg font-bold mb-4 text-black text-center">Generate AI Image</h2>
          <h5 className="text-sm font-bold mb-2 text-gray-500">
            You can use Sinhala or English to input the prompt, and please include at least 20 words
          </h5>
          <h5 className="text-sm font-bold mb-4 text-gray-500">
            ඔබට ප්‍රෝම්ප් එකක් ලබා දීම සඳහා සිංහල හෝ ඉංග්‍රීසි භාෂාව භාවිතා කළ හැක, සහ අවම වශයෙන් වචන 20 ක් ඇතුළත් කරන්න
          </h5>
      
          {/* Textarea for Prompt */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt"
            className="w-full border border-gray-300 rounded p-2 mb-2 text-black text-sm"
          />
      
          {/* Error Message */}
          {prompt.length < 20 && (
            <p className="text-red-500 text-sm mb-4">
              The prompt must be at least 20 characters long.
            </p>
          )}
      
          {isLoading && (
            <div className="flex justify-center items-center mb-4">
              <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
      
          {previewImage && (
            <div className="mb-4">
              <img
                src={previewImage}
                alt="Generated"
                className="w-full rounded shadow-md"
              />
            </div>
          )}
      
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleGenerateImage}
              disabled={prompt.length < 20} // Disable if prompt is too short
              className={`${
                prompt.length >= 20
                  ? 'bg-blue-500 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white font-bold py-2 px-4 rounded w-full`}
            >
              Generate
            </button>
            <button
              onClick={addImageToBox}
              disabled={!previewImage}
              className={`${
                previewImage ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-300'
              } text-white font-bold py-2 px-4 rounded w-full`}
            >
              Use This Image
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      </div>        
      )}

    <div className="flex justify-center items-center bg-yellow-100 text-black py-3 shadow-md rounded-lg mb-8 p-8">
      <form className="h-full" onSubmit={handleSubmit}>

        {/* Category selection */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="Art">Art</option>
          <option value="Technology">Technology</option>
          <option value="Science">Science</option>
          <option value="Fashion">Fashion</option>
        </select>
        
        {/* Topic input */}
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter post topic"
        />

        {/* Description input */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-80"
          placeholder="Enter post description"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      </div>
    </div>
  );
};

export default AddPost;