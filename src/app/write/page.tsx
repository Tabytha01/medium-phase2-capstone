"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import ProtectedRoute from "@/components/ProtectedRoute";
import Editor from "@/components/Editor";
import { CreatePostInput } from "@/types/post";
import axios from "axios";

function WriteContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostInput) => postsApi.create(data),
    onSuccess: () => {
      router.push("/profile");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setCoverImage(base64);
      } catch (error) {
        alert("Failed to upload image");
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSaveDraft = () => {
    createPostMutation.mutate({
      title,
      content,
      excerpt,
      coverImage,
      tags,
      status: "DRAFT",
    });
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }
    createPostMutation.mutate({
      title,
      content,
      excerpt,
      coverImage,
      tags,
      status: "PUBLISHED",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Write a Story</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={createPostMutation.isPending}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={createPostMutation.isPending}
            className="px-4 py-2 bg-[#4A7FA7] dark:bg-white text-white dark:text-[#4A7FA7] rounded hover:opacity-80"
          >
            Publish
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="prose dark:prose-invert max-w-none">
          {coverImage && (
            <img src={coverImage} alt="Cover" className="w-full rounded-lg mb-6" />
          )}
          <h1>{title || "Untitled"}</h1>
          {excerpt && <p className="lead">{excerpt}</p>}
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {tags.length > 0 && (
            <div className="mt-6 flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Cover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            {coverImage && (
              <img src={coverImage} alt="Cover preview" className="mt-4 max-w-md rounded" />
            )}
          </div>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full text-4xl font-bold border-0 focus:ring-0 focus:outline-none dark:bg-transparent"
            />
          </div>

          <div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief excerpt (optional)"
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#4A7FA7] dark:bg-gray-800"
              rows={2}
            />
          </div>

          <div>
            <Editor value={content} onChange={setContent} />
          </div>

          <div>
            <label className="block mb-2 font-medium">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-[#4A7FA7] dark:bg-gray-800"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#4A7FA7] dark:bg-white text-white dark:text-[#4A7FA7] rounded hover:opacity-80"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WritePage() {
  return (
    <ProtectedRoute>
      <WriteContent />
    </ProtectedRoute>
  );
}
