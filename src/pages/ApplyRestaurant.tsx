import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, Mail, Phone, MapPin, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const ApplyRestaurant = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      // Don't send confirmPassword to backend
      const { confirmPassword, ...submitData } = formData;
      const response = await fetch(`${API_BASE_URL}/api/applyRestaurant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Application submitted successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          description: "",
          password: "",
          confirmPassword: "",
        });
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Partner with Eat2Day
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our growing network of restaurants and reach thousands of hungry customers.
            Fill out the form below to get started!
          </p>
        </div>

        {/* Application Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Store className="h-6 w-6" />
              Restaurant Application
            </CardTitle>
            <CardDescription className="text-orange-50">
              Tell us about your restaurant and we'll get back to you within 24-48 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Restaurant Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-orange-600" />
                  Restaurant Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g., The Golden Spoon"
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-orange-600" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="contact@restaurant.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-600" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  Restaurant Address *
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="123 Main Street, City, State, ZIP"
                  value={formData.address}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  Restaurant Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Tell us about your restaurant, cuisine type, specialties, and what makes you unique..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-sm text-gray-500">
                  Minimum 50 characters (current: {formData.description.length})
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-600" />
                  Password (for Vendor Login) *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                  minLength={6}
                />
                <p className="text-sm text-gray-500">
                  This will be your password to login after approval (min 6 characters)
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-600" />
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                  minLength={6}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || formData.description.length < 50}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-6 text-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>

            {/* Info Footer */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>What happens next?</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>✓ Our team will review your application</li>
                <li>✓ You'll receive a response within 24-48 hours</li>
                <li>✓ Once approved, you can login with your email and password</li>
                <li>✓ Start managing your menu and receiving orders!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplyRestaurant;
