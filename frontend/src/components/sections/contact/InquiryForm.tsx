import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactService } from '../../../services/contact.service';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import SuccessModal from './SuccessModal';
import BudgetSlider from '../../ui/sliders/BudgetSlider';
import TimelineSlider from '../../ui/sliders/TimelineSlider';

// Zod Validation Schema
const schema = z.object({
  name: z.string().min(2, { message: 'Full name is required (min 2 chars).' }),
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone must be a valid number (min 10 digits).' }).or(z.literal('')),
  company: z.string().optional(),
  message: z.string().min(10, { message: 'Message must describe your project requirements (min 10 chars).' }).max(1000, { message: 'Message must be under 1000 characters.' })
});

type FormInputs = z.infer<typeof schema>;

const availableProjectTypes = [
  'Website',
  'Software',
  'Mobile App',
  'CRM',
  'ERP',
  'AI',
  'Automation',
  'E-Commerce'
];

export default function InquiryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    }
  });

  // State values for Custom elements
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [projectTypeError, setProjectTypeError] = useState('');
  const [budget, setBudget] = useState(100000);
  const [timeline, setTimeline] = useState(15);
  
  // Submit state
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Textarea auto-resize & counter state
  const [msgLength, setMsgLength] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const toggleProjectType = (type: string) => {
    setSelectedTypes((prev) => {
      const updated = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
      if (updated.length > 0) {
        setProjectTypeError('');
      }
      return updated;
    });
  };

  // Connect textarea reference to calculate auto heights
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMsgLength(e.target.value.length);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Submit Handler using Axios
  const onSubmit = async (data: FormInputs) => {
    if (selectedTypes.length === 0) {
      setProjectTypeError('Please select at least one project type chip.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Map custom sliders values & subject strings
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        budget: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(budget),
        timeline: timeline === 1 ? '1 Day' : `${timeline} Days`,
        subject: `Inquiry: ${selectedTypes.join(', ')}`,
        message: data.message
      };

      const response = await contactService.submitContact(payload);

      if (response.success) {
        setStatus('success');
        setSuccessMessage('We have received your direct inquiry briefs. A senior software architect will contact you in less than 24 hours.');
        reset();
        setSelectedTypes([]);
        setBudget(100000);
        setTimeline(15);
        setMsgLength(0);
      } else {
        setStatus('error');
        setErrorMessage(response.message || 'Error processing request.');
      }
    } catch (err: any) {
      console.error('Inquiry submission failed:', err);
      setStatus('error');
      setErrorMessage(
        err.response?.data?.message || 'Network error submitting request. Please try again.'
      );
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Full Name *"
            iconName="FiUser"
            register={register('name')}
            error={errors.name?.message}
          />
          <InputField
            label="Email Address *"
            iconName="FiMail"
            type="email"
            register={register('email')}
            error={errors.email?.message}
          />
        </div>

        {/* Row 2: Phone & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Phone Number (Optional)"
            iconName="FiPhone"
            register={register('phone')}
            error={errors.phone?.message}
          />
          <InputField
            label="Company Name (Optional)"
            iconName="FiBriefcase"
            register={register('company')}
            error={errors.company?.message}
          />
        </div>

        {/* Project Types Selector (Chips) */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Project Type *
          </span>
          <div className="flex flex-wrap gap-2 mt-1">
            {availableProjectTypes.map((type) => {
              const isSelected = selectedTypes.includes(type);
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => toggleProjectType(type)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-400/10 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'border-white/5 bg-white/[0.01] text-neutral-400 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
          {projectTypeError && (
            <span className="text-[10px] text-rose-500 pl-1 font-medium mt-1">
              {projectTypeError}
            </span>
          )}
        </div>

        {/* Sliders Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <BudgetSlider value={budget} onChange={setBudget} />
          <TimelineSlider value={timeline} onChange={setTimeline} />
        </div>

        {/* Message Input Box with auto-resize and word counters */}
        <div className="flex flex-col gap-1 relative select-none">
          <div className="relative rounded-xl p-[1px] bg-white/5 focus-within:bg-gradient-to-r focus-within:from-cyan-500/30 focus-within:to-blue-500/30 transition-all duration-300">
            <div className="relative rounded-[11px] bg-[#070707]/90 backdrop-blur-xl flex flex-col border border-white/5 focus-within:border-transparent transition-colors duration-300">
              <div className="absolute left-4 top-4 text-neutral-500 pointer-events-none">
                <Icons.FiMessageSquare size={14} />
              </div>

              {/* Textarea */}
              <textarea
                {...register('message')}
                ref={(e) => {
                  register('message').ref(e);
                  textareaRef.current = e;
                }}
                onChange={(e) => {
                  register('message').onChange(e);
                  handleMessageChange(e);
                }}
                placeholder=" "
                className="peer w-full rounded-xl bg-transparent pt-4 pb-8 pl-11 pr-4 text-xs text-white placeholder-transparent outline-none min-h-[110px] resize-none transition-all"
              />

              <label className="absolute left-11 text-xs text-neutral-500 transition-all duration-300 pointer-events-none origin-left 
                peer-placeholder-shown:translate-y-0 
                peer-placeholder-shown:scale-100 
                peer-focus:-translate-y-3.5 
                peer-focus:scale-75 
                peer-focus:text-cyan-400 
                -translate-y-3.5 
                scale-75 
                text-cyan-400/80
                bg-[#070707]/90 px-1 rounded-sm
                peer-focus:bg-[#070707]
                top-4"
              >
                Project details: Describe your features or requirements *
              </label>

              {/* Word counter label */}
              <div className="absolute right-3 bottom-2 text-[9px] font-mono text-neutral-600">
                {msgLength} / 1000
              </div>
            </div>
          </div>
          {errors.message?.message && (
            <span className="text-[10px] text-rose-500 pl-1 font-medium">
              {errors.message.message}
            </span>
          )}
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <p className="text-xs font-semibold text-rose-400 text-center bg-rose-950/10 border border-rose-500/15 py-2.5 rounded-xl">
            {errorMessage}
          </p>
        )}

        {/* Submission Button */}
        <SubmitButton isLoading={status === 'loading'} />
      </form>

      {/* Success Modal Notification Trigger */}
      <SuccessModal
        isOpen={status === 'success'}
        onClose={() => setStatus('idle')}
        message={successMessage}
      />
    </div>
  );
}
// Local custom icons fallback
const Icons = {
  FiMessageSquare: (props: any) => (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
};
