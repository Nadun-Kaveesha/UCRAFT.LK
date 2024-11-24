"use client"; // Add this line at the top

import React, { useState } from "react";

const TopBar = () => {
  return (
    <div className="bg-yellow-400 text-black py-3 text-center shadow-md">
      <h1 className="text-lg font-bold">Create Post</h1>
    </div>
  );
};

const PostForm = () => {
  const [topic, setTopic] = useState(""); // Topic
  const [description, setDescription] = useState(""); // Post description
  const [category, setCategory] = useState(""); // Selected category
  const [prompt, setPrompt] = useState(""); // AI prompt
  const [image, setImage] = useState(null); // Image (uploaded or AI-generated)
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    setIsLoading(true); // Show loading spinner
    setImage(null); // Clear previous image

    try {
      const response = await fetch("http://localhost:3001/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setImage(imageUrl); // Set the generated image
    } catch (error) {
      console.error(error);
      alert("Error generating image. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file)); // Set the uploaded image
    } else {
      alert("Please upload a valid image file.");
    }
  };

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
    <div className="h-screen w-screen p-4">
      <form className="h-full" onSubmit={handleSubmit}>
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter post description"
        />

        {/* Category selection */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="Cake">Cake</option>
          <option value="Wood_work">Wood Work</option>
          <option value="Clothes">Clothes</option>
          <option value="Fashion">Fashion</option>
        </select>

        {/* AI Prompt input */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Enter AI image generation prompt"
        />

        {/* Buttons line by line */}
        <div className="flex flex-col gap-4 mb-4">
          {/* Generate AI Image Button */}
          <button
            type="button"
            onClick={handleGenerateImage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none flex items-center gap-2"
          >
            <span>✨</span> Generate AI Image
          </button>

          {/* Upload Image Button */}
          <button
            type="button"
            onClick={() => document.getElementById("imageInput").click()}
            className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded focus:outline-none flex items-center gap-2"
          >
            <span>⬆️</span> Upload Image
          </button>
        </div>

        {/* Hidden file input for uploading images */}
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Display selected/generated image */}
        {image && (
          <div className="mt-4">
            <img
              src={image}
              alt="Uploaded or Generated"
              className="max-w-xs rounded shadow-md mb-4"
            />
            <p className="text-gray-500 text-sm">Preview of selected/generated image</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

const AddPost = () => {
  return (
    <div>
      <TopBar />
      <PostForm />
    </div>
  );
};

export default AddPost;