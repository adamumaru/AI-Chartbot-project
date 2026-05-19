import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Search, Library, FileText, Settings, Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useKnowledge } from "../../hooks/useKnowledge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

export function KnowledgeView() {
  const { knowledge, addKnowledge, updateKnowledge, deleteKnowledge, saveKnowledge } = useKnowledge();
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", content: "", category: "General" });
  const [editingItem, setEditingItem] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredKnowledge = knowledge.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.content.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newItem.title || !newItem.content) {
      toast.error("Please fill in both title and content");
      return;
    }
    addKnowledge(newItem);
    setNewItem({ title: "", content: "", category: "General" });
    setIsAdding(false);
    toast.success("Knowledge item added successfully");
  };

  const handleUpdate = () => {
    if (!editingItem.title || !editingItem.content) {
      toast.error("Please fill in both title and content");
      return;
    }
    updateKnowledge(editingItem.id, editingItem);
    setEditingItem(null);
    toast.success("Knowledge item updated");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(knowledge, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "knowledge_base.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Knowledge base exported");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          saveKnowledge(imported);
          toast.success("Knowledge base imported successfully");
        } catch (err) {
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Knowledge Library</h2>
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Restricted environment sources</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="h-10 rounded-xl px-4 gap-2 bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold tracking-widest uppercase">
            <Upload size={14} />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="h-10 rounded-xl px-4 gap-2 bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-bold tracking-widest uppercase">
            <Download size={14} />
            Export
          </Button>
          <Button onClick={() => setIsAdding(true)} className="h-10 rounded-xl px-6 gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 text-xs font-bold tracking-widest uppercase border-none">
            <Plus size={14} />
            Add Entry
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
            accept=".json"
          />
        </div>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <Input 
          placeholder="Filter sources by keywords..." 
          className="pl-12 h-14 rounded-2xl bg-slate-900 border-slate-800 focus:ring-indigo-500/50 text-slate-200 placeholder:text-slate-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 pr-4">
          <AnimatePresence>
            {filteredKnowledge.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                layout
              >
                <Card className="flex flex-col h-full bg-[#0f172a]/30 border-slate-800/50 hover:bg-[#0f172a]/50 hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden rounded-3xl group shadow-sm">
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-slate-800 text-slate-400 border-slate-700 rounded-lg px-2 py-1 text-[9px] uppercase font-bold tracking-[0.1em]">
                        {item.category}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 text-slate-500 hover:text-indigo-400" onClick={() => setEditingItem(item)}>
                          <Settings size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 text-slate-500 hover:text-destructive" onClick={() => deleteKnowledge(item.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-white truncate group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-5 leading-relaxed mb-4">
                      {item.content}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                       <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Active Source</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 tracking-wider">{new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredKnowledge.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
            <Library size={48} className="mb-4" />
            <h3 className="text-xl font-bold uppercase tracking-widest">Index Empty</h3>
          </div>
        )}
      </ScrollArea>

      {/* Add Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] bg-[#0f172a] border-slate-800 p-8">
          <DialogHeader>
            <DialogTitle className="text-white">Add Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Title</Label>
              <Input 
                id="title" 
                placeholder="Ex: Technical Documentation" 
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                className="rounded-xl bg-slate-900 border-slate-800 h-12 text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Category</Label>
              <Input 
                id="category" 
                placeholder="Ex: HR, Tech, General" 
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="rounded-xl bg-slate-900 border-slate-800 h-12 text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Content Content</Label>
              <textarea 
                id="content" 
                rows={6}
                className="flex w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus-visible:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Paste the detailed information here..."
                value={newItem.content}
                onChange={(e) => setNewItem({...newItem, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl text-slate-500 hover:text-slate-300">Cancel</Button>
            <Button onClick={handleAdd} className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-8 border-none font-bold uppercase tracking-widest text-xs h-12">Submit Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] bg-[#0f172a] border-slate-800 p-8">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Title</Label>
              <Input 
                id="edit-title" 
                value={editingItem?.title}
                onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                className="rounded-xl bg-slate-900 border-slate-800 h-12 text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Category</Label>
              <Input 
                id="edit-category" 
                value={editingItem?.category}
                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                className="rounded-xl bg-slate-900 border-slate-800 h-12 text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content" className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">Content</Label>
              <textarea 
                id="edit-content" 
                rows={6}
                className="flex w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200 focus-visible:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={editingItem?.content}
                onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setEditingItem(null)} className="rounded-xl text-slate-500 hover:text-slate-300">Cancel</Button>
            <Button onClick={handleUpdate} className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-8 border-none font-bold uppercase tracking-widest text-xs h-12">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
