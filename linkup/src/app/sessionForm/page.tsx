'use client';

import { useState } from 'react';
import { Button } from '@/app/(pages)/_components/ui/button';
import type Session from '@/app/_types/session/Session';
// Form for Edit/Create session in Figma
interface SessionFormProps {
  initialValues?: Partial<Session>;
  onSubmit: (session: Partial<Session>) => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

const noiseLevels = ['Silent', 'Quiet', 'Moderate', 'Collaborative'];

export default function SessionForm({
  initialValues = {},
  onSubmit,
  onDelete,
  // true for edit, false for create
  isEditing = false,
}: SessionFormProps) {
  // Set up internal state for the form fields
  const [form, setForm] = useState({
    title: initialValues.title ?? '',
    description: initialValues.description ?? '',
    location: initialValues.location ?? '',
    day: initialValues.day ?? '',
    startTime: initialValues.startTime
      ? new Date(initialValues.startTime).toTimeString().slice(0, 5)
      : '',
    endTime: initialValues.endTime
      ? new Date(initialValues.endTime).toTimeString().slice(0, 5)
      : '',
    // Default to 'Moderate'
    noise: initialValues.noise ?? 2,
    capacity: initialValues.capacity ?? 1,
  });
  // Update form state when input fields change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value,
    }));
  };
  // Handle clicking a noise level button
  const handleNoiseClick = (i: number) =>
    setForm((prev) => ({ ...prev, noise: i }));
  // When form is submitted (Create or Save Changes)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parseTime = (t: string) => new Date(`${form.day}T${t}`);
    onSubmit({
      ...initialValues,
      ...form,
      startTime: parseTime(form.startTime),
      endTime: parseTime(form.endTime),
    });
  };
  // Shared input styling
  const inputClass =
    'mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-200 focus:ring-opacity-50';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-xl shadow-md p-8 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-sky-950">
          {isEditing ? 'Edit Session' : 'Create Session'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Make a study session to study with other students
        </p>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Subject or Session Name
        </label>
        <input
          id="title"
          name="title"
          value={String(form.title)}
          onChange={handleChange}
          className={inputClass}
          placeholder="162 Coding Session"
        />
      </div>

      {/* Location + Times */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            name="location"
            value={String(form.location)}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        {/* Start Time */}
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Time Start
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        {/* End Time */}
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            Time End
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            value={form.endTime}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Capacity, Noise, Day */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Group Size */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Group Size
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            value={String(form.capacity)}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        {/* Noise Level Buttons */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Noise Level</label>
          <div className="mt-1 flex rounded-md border border-gray-300 overflow-hidden">
            {noiseLevels.map((level, i) => (
              <button
                key={level}
                type="button"
                onClick={() => handleNoiseClick(i)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                  form.noise === i
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } ${i < noiseLevels.length - 1 ? 'border-r border-gray-300' : ''}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div>
          {/* Date Field */}
          <label htmlFor="day" className="block text-sm font-medium text-gray-700">
            Day
          </label>
          <input
            id="day"
            name="day"
            type="date"
            value={String(form.day)}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Session Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={String(form.description)}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder="Add details like topics to cover, expectations..."
        />
        <p className="mt-1 text-xs text-gray-500">
          {form.description.split(/\s+/).filter(Boolean).length}/300 words max
        </p>
      </div>

      {/* Footer Buttons */}
      {isEditing ? (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Delete button */}
          <Button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md"
          >
            Delete Session
          </Button>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            {/* Cancle button */}
            <Button
              type="button"
              onClick={() => window.history.back()}
              className="w-full md:w-auto px-6 py-3 text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 rounded-lg"
            >
              Cancel Changes
            </Button>
            {/* Save button */}
            <Button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600"
            >
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600"
          >
            Create Session
          </Button>
        </div>
      )}

    </form>
  );
}
