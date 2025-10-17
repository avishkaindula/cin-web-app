"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createReward, type CreateRewardData } from "../manage-rewards/actions";
import { useToast } from "@/hooks/use-toast";

export default function CreateRewardForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState<Partial<CreateRewardData>>({
    title: "",
    description: "",
    type: "",
    category: "",
    value: "",
    points_cost: 0,
    availability: "unlimited",
    quantity_available: undefined,
    expiry_date: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points_cost" || name === "quantity_available" 
        ? parseInt(value) || 0 
        : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (status: "draft" | "active") => {
    // Validate required fields
    if (!formData.title?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a reward title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a description",
        variant: "destructive",
      });
      return;
    }

    if (!formData.type) {
      toast({
        title: "Validation Error",
        description: "Please select a reward type",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (!formData.points_cost || formData.points_cost <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid points cost",
        variant: "destructive",
      });
      return;
    }

    if (formData.availability === "limited" && (!formData.quantity_available || formData.quantity_available <= 0)) {
      toast({
        title: "Validation Error",
        description: "Please enter quantity available for limited rewards",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await createReward({
        title: formData.title!,
        description: formData.description!,
        type: formData.type!,
        category: formData.category!,
        value: formData.value,
        points_cost: formData.points_cost!,
        availability: formData.availability!,
        quantity_available: formData.quantity_available,
        expiry_date: formData.expiry_date || undefined,
        status,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Reward ${status === "draft" ? "saved as draft" : "created and published"}`,
        });
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          type: "",
          category: "",
          value: "",
          points_cost: 0,
          availability: "unlimited",
          quantity_available: undefined,
          expiry_date: "",
        });
        
        // Refresh the page to show the new reward
        router.refresh();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Reward</CardTitle>
        <CardDescription>
          Design compelling rewards that motivate environmental action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Reward Title
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Eco-Warrior Badge"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Reward Type
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital-badge">Digital Badge</SelectItem>
                <SelectItem value="discount-voucher">Discount Voucher</SelectItem>
                <SelectItem value="educational-access">Educational Access</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="physical-item">Physical Item</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="recognition">Recognition</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Points Cost
            </label>
            <Input
              name="points_cost"
              type="number"
              value={formData.points_cost}
              onChange={handleInputChange}
              placeholder="500"
              min="0"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Availability
            </label>
            <Select
              value={formData.availability}
              onValueChange={(value) => handleSelectChange("availability", value as "unlimited" | "limited")}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlimited">Unlimited</SelectItem>
                <SelectItem value="limited">Limited Quantity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.availability === "limited" && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Quantity Available
            </label>
            <Input
              name="quantity_available"
              type="number"
              value={formData.quantity_available || ""}
              onChange={handleInputChange}
              placeholder="100"
              min="1"
              disabled={isPending}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Value/Savings
            </label>
            <Input
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="e.g., $50 savings, Recognition"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Expiry Date (Optional)
            </label>
            <Input
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={handleInputChange}
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
            Description
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the reward, how to claim it, and any terms and conditions..."
            rows={4}
            disabled={isPending}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleSubmit("active")}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPending ? "Creating..." : "Create Reward"}
          </Button>
          <Button
            onClick={() => handleSubmit("draft")}
            disabled={isPending}
            variant="outline"
          >
            {isPending ? "Saving..." : "Save as Draft"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
