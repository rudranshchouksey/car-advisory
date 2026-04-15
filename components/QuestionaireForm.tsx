"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Wallet, 
  Fuel, 
  Navigation2, 
  Users2, 
  Settings2, 
  MessageSquarePlus,
  Loader2
} from "lucide-react";

export type Preferences = {
  budget: string;
  fuelType: string;
  useCase: string;
  seating: string;
  transmission: string;
  priorities: string;
};

type Props = {
  onSubmit: (prefs: Preferences) => void;
  loading: boolean;
};

export default function QuestionnaireForm({ onSubmit, loading }: Props) {
  const [prefs, setPrefs] = useState<Preferences>({
    budget: "1500000",
    fuelType: "any",
    useCase: "any",
    seating: "5",
    transmission: "any",
    priorities: "",
  });

  const set = (key: keyof Preferences) => (val: string) =>
    setPrefs((p) => ({ ...p, [key]: val }));

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white overflow-hidden rounded-3xl">
      {/* Decorative Brand Accent */}
      <div className="h-2 w-full bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      <CardHeader className="pb-8 pt-10 px-8 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-blue-50 text-blue-600">
          <Sparkles className="w-6 h-6" />
        </div>
        <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
          Car Discovery Engine
        </CardTitle>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Tailor your search with AI. Our engine analyzes thousands of specs to find your ideal match.
        </p>
      </CardHeader>

      <CardContent className="px-8 pb-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          
          {/* 01. Budget Selection */}
          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Wallet className="w-3.5 h-3.5" /> 01. Maximum Budget
            </Label>
            <Select onValueChange={set("budget")} defaultValue={prefs.budget}>
              <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-base font-medium shadow-sm px-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-100 bg-white border border-slate-200 shadow-xl rounded-xl min-w-(--radix-select-trigger-width)">
                <SelectItem value="500000" className="cursor-pointer py-3">Under ₹5 Lakhs</SelectItem>
                <SelectItem value="800000" className="cursor-pointer py-3">Under ₹8 Lakhs</SelectItem>
                <SelectItem value="1200000" className="cursor-pointer py-3">Under ₹12 Lakhs</SelectItem>
                <SelectItem value="1500000" className="cursor-pointer py-3">Under ₹15 Lakhs</SelectItem>
                <SelectItem value="2000000" className="cursor-pointer py-3">Under ₹20 Lakhs</SelectItem>
                <SelectItem value="2500000" className="cursor-pointer py-3">Under ₹25 Lakhs</SelectItem>
                <SelectItem value="5000000" className="cursor-pointer py-3">Under ₹50 Lakhs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 02. Engine Type */}
          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Fuel className="w-3.5 h-3.5" /> 02. Engine Type
            </Label>
            <Select onValueChange={set("fuelType")} defaultValue={prefs.fuelType}>
              <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-base font-medium shadow-sm px-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-100 bg-white border border-slate-200 shadow-xl rounded-xl min-w-(--radix-select-trigger-width)">
                <SelectItem value="any" className="cursor-pointer py-3">Flexible (All Types)</SelectItem>
                <SelectItem value="Petrol" className="cursor-pointer py-3">Petrol</SelectItem>
                <SelectItem value="Diesel" className="cursor-pointer py-3">Diesel</SelectItem>
                <SelectItem value="CNG" className="cursor-pointer py-3">CNG / Green</SelectItem>
                <SelectItem value="Electric" className="cursor-pointer py-3">Electric (EV)</SelectItem>
                <SelectItem value="Hybrid" className="cursor-pointer py-3">Hybrid Tech</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 03. Primary Environment */}
          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Navigation2 className="w-3.5 h-3.5" /> 03. Primary Environment
            </Label>
            <Select onValueChange={set("useCase")} defaultValue={prefs.useCase}>
              <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-base font-medium shadow-sm px-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5} className="z-100 bg-white border border-slate-200 shadow-xl rounded-xl min-w-(--radix-select-trigger-width)">
                <SelectItem value="any" className="cursor-pointer py-3">Mixed Use</SelectItem>
                <SelectItem value="city" className="cursor-pointer py-3">Urban / City Commute</SelectItem>
                <SelectItem value="highway" className="cursor-pointer py-3">Highways / Inter-city</SelectItem>
                <SelectItem value="family" className="cursor-pointer py-3">Family / School Runs</SelectItem>
                <SelectItem value="offroad" className="cursor-pointer py-3">Rough Terrain / Adventure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 04 & 05. Combined Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Users2 className="w-3.5 h-3.5" /> 04. Seats
              </Label>
              <Select onValueChange={set("seating")} defaultValue={prefs.seating}>
                <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-base font-medium shadow-sm px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5} className="z-100 bg-white border border-slate-200 shadow-xl rounded-xl min-w-(--radix-select-trigger-width)">
                  <SelectItem value="2" className="cursor-pointer py-3">2+</SelectItem>
                  <SelectItem value="5" className="cursor-pointer py-3">5 Seats</SelectItem>
                  <SelectItem value="7" className="cursor-pointer py-3">7 Seats</SelectItem>
                  <SelectItem value="8" className="cursor-pointer py-3">8+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" /> 05. Gears
              </Label>
              <Select onValueChange={set("transmission")} defaultValue={prefs.transmission}>
                <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-base font-medium shadow-sm px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5} className="z-100 bg-white border border-slate-200 shadow-xl rounded-xl min-w-(--radix-select-trigger-width)">
                  <SelectItem value="any" className="cursor-pointer py-3">Either</SelectItem>
                  <SelectItem value="Manual" className="cursor-pointer py-3">Manual</SelectItem>
                  <SelectItem value="Automatic" className="cursor-pointer py-3">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Priorities Section */}
        <div className="space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-blue-500" /> 
            Any specific lifestyle requirements?
          </Label>
          <Textarea
            placeholder="e.g. 'I prioritize safety ratings', 'Need a massive boot'..."
            value={prefs.priorities}
            onChange={(e) => set("priorities")(e.target.value)}
            className="bg-white border-slate-200 rounded-2xl resize-none text-base min-h-25 focus:ring-blue-500 shadow-inner"
          />
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="w-full h-16 text-lg font-bold bg-slate-900 hover:bg-blue-600 text-white rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          onClick={() => onSubmit(prefs)}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Your Profile...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Generate Expert Recommendations <Sparkles className="w-5 h-5" />
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}