import { Label } from '@/components/ui/label'

interface CategoryInputProps {
  category: string | null;
  updateCategory: (value: string | null) => void;
}

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Sauces/Marinades']

export default function CategoryInput({ category, updateCategory }: CategoryInputProps) {
  return (
    <div className="flex flex-col gap-1 min-w-[10rem]">
      <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
      <select
        id="category"
        required
        value={category ?? ''}
        onChange={(e) => updateCategory(e.target.value || null)}
        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="" disabled>Select category</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}
