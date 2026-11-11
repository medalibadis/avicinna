'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedEntityPath, getLocalizedPath } from '@/lib/i18nRoutes';
import type { Locale, MediaItem } from '@/types/cms';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Table as TableIcon,
  Image as ImageIcon,
  Code2,
  Type,
  X,
  Check,
  Search,
  Upload,
  Loader2,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  dir?: 'rtl' | 'ltr';
  lang?: Locale;
  label?: string;
  placeholder?: string;
  minHeight?: number;
}

const rteDict = {
  ar: {
    paragraph: 'فقرة نصية',
    link: 'رابط',
    table: 'جدول',
    image: 'صورة',
    visual: 'مرئي',
    html: 'HTML',
    linkModalTitle: 'إدراج رابط داخلي أو خارجي',
    anchorPh: 'نص الرابط (مثال: جراحة القلب في إسطنبول)',
    urlPh: 'الرابط (مثال: /treatments/cardiac-surgery أو https://...)',
    searchPh: 'ابحث في العلاجات والأطباء والمستشفيات...',
    cancel: 'إلغاء',
    insertLink: 'إدراج الرابط',
    tableModalTitle: 'إدراج جدول منظم',
    rows: 'عدد الصفوف',
    cols: 'عدد الأعمدة',
    insertTable: 'إدراج الجدول',
    imageModalTitle: 'إدراج صورة مع النص البديل (Alt Text)',
    uploadMedia: 'رفع صورة إلى مكتبة الوسائط',
    pickMedia: 'أو اختر من مكتبة الوسائط:',
    imgUrlPh: 'رابط الصورة',
    imgAltPh: 'النص البديل SEO Alt Text (ضروري لمحركات البحث)',
    imgCaptionPh: 'تسمية توضيحية تحت الصورة (اختياري)',
    insertImage: 'إدراج الصورة',
    groups: { Treatment: 'علاج', Doctor: 'طبيب', Hospital: 'مستشفى', Article: 'مقال', Page: 'صفحة' } as Record<string, string>,
  },
  fr: {
    paragraph: 'Paragraphe',
    link: 'Lien',
    table: 'Tableau',
    image: 'Image',
    visual: 'Visuel',
    html: 'HTML',
    linkModalTitle: 'Insérer un lien interne ou externe',
    anchorPh: 'Texte du lien (ex: Chirurgie cardiaque à Istanbul)',
    urlPh: 'URL (ex: /fr/treatments/chirurgie-cardiaque ou https://...)',
    searchPh: 'Rechercher soins, médecins, hôpitaux...',
    cancel: 'Annuler',
    insertLink: 'Insérer le lien',
    tableModalTitle: 'Insérer un tableau',
    rows: 'Lignes',
    cols: 'Colonnes',
    insertTable: 'Insérer le tableau',
    imageModalTitle: 'Insérer une image avec texte Alt',
    uploadMedia: 'Importer vers la Médiathèque',
    pickMedia: 'Ou choisir depuis la Médiathèque :',
    imgUrlPh: 'URL de l’image',
    imgAltPh: 'Texte Alt SEO (Requis pour Google Images)',
    imgCaptionPh: 'Légende de l’image (Optionnel)',
    insertImage: 'Insérer l’image',
    groups: { Treatment: 'Soin', Doctor: 'Médecin', Hospital: 'Hôpital', Article: 'Article', Page: 'Page' } as Record<string, string>,
  },
  en: {
    paragraph: 'Paragraph',
    link: 'Link',
    table: 'Table',
    image: 'Image',
    visual: 'Visual',
    html: 'HTML',
    linkModalTitle: 'Insert Internal or External Link',
    anchorPh: 'Anchor Text (e.g., Cardiac Surgery in Istanbul)',
    urlPh: 'URL (e.g., /treatments/cardiac-surgery or https://...)',
    searchPh: 'Search internal treatments, doctors, hospitals...',
    cancel: 'Cancel',
    insertLink: 'Insert Link',
    tableModalTitle: 'Insert Table',
    rows: 'Rows',
    cols: 'Columns',
    insertTable: 'Insert Table',
    imageModalTitle: 'Insert Image with Alt Text',
    uploadMedia: 'Upload Image to Media Library',
    pickMedia: 'Pick from Media Library:',
    imgUrlPh: 'Image URL',
    imgAltPh: 'SEO Alt Text (Required for accessibility & Google Images)',
    imgCaptionPh: 'Optional Figure Caption',
    insertImage: 'Insert Image',
    groups: { Treatment: 'Treatment', Doctor: 'Doctor', Hospital: 'Hospital', Article: 'Article', Page: 'Page' } as Record<string, string>,
  },
};

export function RichTextEditor({
  value,
  onChange,
  dir = 'rtl',
  lang = 'ar',
  label,
  placeholder,
  minHeight = 280,
}: RichTextEditorProps) {
  const { treatments, doctors, hospitals, articles, pages, media, setMedia } = useData();
  const { language, direction } = useLanguage();
  const uiLang = language === 'fr' || language === 'en' ? language : 'ar';
  const t = rteDict[uiLang];
  const editorRef = useRef<HTMLDivElement>(null);
  const [sourceMode, setSourceMode] = useState(false);

  // Modals
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkSearch, setLinkSearch] = useState('');
  const savedRangeRef = useRef<Range | null>(null);

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const [imgCaption, setImgCaption] = useState('');
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  // Sync external value changes safely into contentEditable
  useEffect(() => {
    if (!sourceMode && editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, sourceMode, lang]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const runCmd = (command: string, val?: string) => {
    if (sourceMode) return;
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  const insertHtmlAtCursor = (html: string) => {
    editorRef.current?.focus();
    restoreSelection();
    if (!document.execCommand('insertHTML', false, html) && editorRef.current) {
      editorRef.current.innerHTML += html;
    }
    handleInput();
  };

  const internalTargets = React.useMemo(() => {
    const q = linkSearch.toLowerCase().trim();
    const list: Array<{ label: string; group: string; url: string }> = [
      ...treatments.map((t) => ({
        group: 'Treatment',
        label: t.title[lang] || t.title.ar || t.title.en,
        url: getLocalizedEntityPath('treatments', t, lang),
      })),
      ...doctors.map((d) => ({
        group: 'Doctor',
        label: d.name[lang] || d.name.ar || d.name.en,
        url: getLocalizedEntityPath('doctors', d, lang),
      })),
      ...hospitals.map((h) => ({
        group: 'Hospital',
        label: h.name[lang] || h.name.ar || h.name.en,
        url: getLocalizedEntityPath('hospitals', h, lang),
      })),
      ...articles.map((a) => ({
        group: 'Article',
        label: a.title[lang] || a.title.ar || a.title.en,
        url: getLocalizedEntityPath('blog', a, lang),
      })),
      ...pages.map((p) => ({
        group: 'Page',
        label: p.title[lang] || p.title.ar || p.title.en,
        url: getLocalizedPath(`/${p.slugs?.[lang] || p.slug}`, lang),
      })),
    ];
    return q
      ? list.filter((i) => i.label.toLowerCase().includes(q) || i.url.toLowerCase().includes(q)).slice(0, 12)
      : list.slice(0, 12);
  }, [linkSearch, treatments, doctors, hospitals, articles, pages, lang]);

  const handleOpenLinkModal = () => {
    saveSelection();
    const selectedText = window.getSelection()?.toString() || '';
    setLinkText(selectedText);
    setLinkUrl('');
    setLinkSearch('');
    setLinkModalOpen(true);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const safeUrl = linkUrl.trim().replace(/"/g, '&quot;');
    const text = (linkText.trim() || linkUrl.trim()).replace(/</g, '&lt;');
    const targetAttr = safeUrl.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
    insertHtmlAtCursor(`<a href="${safeUrl}"${targetAttr}>${text}</a>`);
    setLinkModalOpen(false);
  };

  const handleInsertTable = () => {
    const rCount = Math.max(1, Math.min(12, tableRows));
    const cCount = Math.max(1, Math.min(8, tableCols));
    const headerPrefix = lang === 'ar' ? 'العنوان' : lang === 'fr' ? 'En-tête' : 'Header';
    const dataText = lang === 'ar' ? 'بيانات' : lang === 'fr' ? 'Donnée' : 'Data';
    let headerCells = '';
    for (let c = 0; c < cCount; c++) {
      headerCells += `<th>${headerPrefix} ${c + 1}</th>`;
    }
    let bodyRows = '';
    for (let r = 0; r < rCount - 1; r++) {
      let rowCells = '';
      for (let c = 0; c < cCount; c++) {
        rowCells += `<td>${dataText}</td>`;
      }
      bodyRows += `<tr>${rowCells}</tr>`;
    }
    const tableHtml = `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table><p><br/></p>`;
    insertHtmlAtCursor(tableHtml);
    setTableModalOpen(false);
  };

  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('altAr', imgAlt || file.name);
      fd.append('altEn', imgAlt || file.name);
      fd.append('altFr', imgAlt || file.name);
      fd.append('folder', 'articles');
      const res = await fetch('/api/media', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.item) {
        const item = data.item as MediaItem;
        setMedia((prev) => [item, ...prev]);
        setImgUrl(item.url);
        if (!imgAlt) setImgAlt(item.alt[lang] || item.alt.en || file.name);
      }
    } finally {
      setIsUploadingImg(false);
      e.target.value = '';
    }
  };

  const handleInsertImage = () => {
    if (!imgUrl.trim()) return;
    const safeSrc = imgUrl.trim().replace(/"/g, '&quot;');
    const safeAlt = (imgAlt.trim() || 'AVICINNA Medical Image').replace(/"/g, '&quot;');
    const cap = imgCaption.trim()
      ? `<figcaption style="font-size:0.85em;color:#64748b;margin-top:0.5rem;">${imgCaption
          .trim()
          .replace(/</g, '&lt;')}</figcaption>`
      : '';
    insertHtmlAtCursor(`<figure><img src="${safeSrc}" alt="${safeAlt}" />${cap}</figure><p><br/></p>`);
    setImageModalOpen(false);
    setImgUrl('');
    setImgAlt('');
    setImgCaption('');
  };

  const btnClass =
    'p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{label}</label>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
          <button type="button" onClick={() => runCmd('formatBlock', 'P')} className={btnClass} title="Paragraph">
            <Type className="w-3.5 h-3.5" />
            <span>P</span>
          </button>
          <button type="button" onClick={() => runCmd('formatBlock', 'H2')} className={btnClass} title="Heading 2 (H2)">
            <Heading2 className="w-4 h-4" />
            <span>H2</span>
          </button>
          <button type="button" onClick={() => runCmd('formatBlock', 'H3')} className={btnClass} title="Heading 3 (H3)">
            <Heading3 className="w-4 h-4" />
            <span>H3</span>
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button type="button" onClick={() => runCmd('bold')} className={btnClass} title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => runCmd('italic')} className={btnClass} title="Italic">
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button type="button" onClick={() => runCmd('insertUnorderedList')} className={btnClass} title="Bullet List">
            <List className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => runCmd('insertOrderedList')} className={btnClass} title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => runCmd('formatBlock', 'BLOCKQUOTE')} className={btnClass} title="Quote">
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button type="button" onClick={handleOpenLinkModal} className={btnClass} title={t.linkModalTitle}>
            <Link2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>{t.link}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              saveSelection();
              setTableModalOpen(true);
            }}
            className={btnClass}
            title={t.tableModalTitle}
          >
            <TableIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.table}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              saveSelection();
              setImageModalOpen(true);
            }}
            className={btnClass}
            title={t.imageModalTitle}
          >
            <ImageIcon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>{t.image}</span>
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setSourceMode((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              sourceMode
                ? 'bg-sky-600 text-white'
                : 'bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{sourceMode ? t.visual : t.html}</span>
          </button>
        </div>

        {/* Editor Area */}
        {sourceMode ? (
          <textarea
            dir="ltr"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            className="w-full p-4 font-mono text-xs bg-slate-950 text-sky-200 focus:outline-none resize-y"
            placeholder="<h2>...</h2><p>...</p>"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            dir={dir}
            onInput={handleInput}
            style={{ minHeight }}
            data-placeholder={placeholder || ''}
            className="p-4 text-sm text-slate-800 dark:text-slate-100 leading-relaxed focus:outline-none max-w-none [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-[#032654] dark:[&_h2]:text-white [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-1 [&_ol]:mb-3 [&_a]:text-sky-600 [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:bg-slate-100 dark:[&_th]:bg-slate-800 [&_th]:p-2 [&_th]:border [&_th]:border-slate-300 dark:[&_th]:border-slate-600 [&_td]:p-2 [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-slate-700 [&_img]:rounded-xl [&_img]:max-h-64 [&_img]:my-3 [&_blockquote]:border-s-4 [&_blockquote]:border-sky-500 [&_blockquote]:ps-3 [&_blockquote]:italic"
          />
        )}
      </div>

      {/* Link Picker Modal */}
      {linkModalOpen && (
        <div dir={direction} className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Link2 className="w-4 h-4 text-sky-500" />
                <span>{t.linkModalTitle}</span>
              </h4>
              <button type="button" onClick={() => setLinkModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder={t.anchorPh}
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
              <input
                type="text"
                dir="ltr"
                placeholder={t.urlPh}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 start-3" />
                <input
                  type="text"
                  placeholder={t.searchPh}
                  value={linkSearch}
                  onChange={(e) => setLinkSearch(e.target.value)}
                  className="w-full ps-8 pe-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div className="max-h-44 overflow-y-auto space-y-1">
                {internalTargets.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setLinkUrl(item.url);
                      if (!linkText) setLinkText(item.label);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/40 text-start text-xs cursor-pointer"
                  >
                    <span className="truncate font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                    <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 ms-2 shrink-0">
                      {t.groups[item.group] || item.group}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t.insertLink}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Builder Modal */}
      {tableModalOpen && (
        <div dir={direction} className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">{t.tableModalTitle}</h4>
              <button type="button" onClick={() => setTableModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">{t.rows}</label>
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">{t.cols}</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                {t.insertTable}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image + Alt Text Modal */}
      {imageModalOpen && (
        <div dir={direction} className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-violet-500" />
                <span>{t.imageModalTitle}</span>
              </h4>
              <button type="button" onClick={() => setImageModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 cursor-pointer hover:border-sky-500">
                {isUploadingImg ? <Loader2 className="w-4 h-4 animate-spin text-sky-500" /> : <Upload className="w-4 h-4 text-sky-500" />}
                <span>{t.uploadMedia}</span>
                <input type="file" accept="image/*" onChange={handleMediaFileUpload} className="hidden" />
              </label>

              {media.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">{t.pickMedia}</div>
                  <div className="grid grid-cols-5 gap-2 max-h-28 overflow-y-auto p-1">
                    {media.slice(0, 15).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setImgUrl(m.url);
                          setImgAlt(m.alt[lang] || m.alt.en || m.filename);
                        }}
                        className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                          imgUrl === m.url ? 'border-sky-500' : 'border-transparent'
                        }`}
                      >
                        <img src={m.url} alt={m.alt.en} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <input
                type="text"
                dir="ltr"
                placeholder={t.imgUrlPh}
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
              <input
                type="text"
                placeholder={t.imgAltPh}
                value={imgAlt}
                onChange={(e) => setImgAlt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder={t.imgCaptionPh}
                value={imgCaption}
                onChange={(e) => setImgCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleInsertImage}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold cursor-pointer"
              >
                {t.insertImage}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

