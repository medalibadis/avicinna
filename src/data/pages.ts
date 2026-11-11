import { CmsPage } from '@/types/cms';

export const initialPagesData: CmsPage[] = [
  {
    id: 'page-privacy',
    slug: 'privacy',
    slugs: {
      ar: 'privacy',
      en: 'privacy',
      fr: 'privacy',
    },
    title: {
      ar: 'سياسة الخصوصية وحماية البيانات الطبية',
      en: 'Privacy Policy & Medical Data Confidentiality',
      fr: 'Politique de Confidentialité & Secret Médical',
    },
    subtitle: {
      ar: 'التزام منصة AVICINNA بحماية سرية ملفات المرضى والتقارير الطبية وفق معايير GDPR وKVKK وHIPAA.',
      en: 'How AVICINNA protects patient identity, clinical records, and diagnostic files under GDPR, KVKK, and HIPAA safeguards.',
      fr: 'Engagement d’AVICINNA pour la protection des dossiers médicaux et des données personnelles selon les normes RGPD, KVKK et HIPAA.',
    },
    contentHtml: {
      ar: `
<h2>1. مقدمة والتزامنا بالسرية الطبية</h2>
<p>تلتزم منصة <strong>AVICINNA للرعاية الطبية الدولية</strong> بحماية خصوصية المرضى الدوليين والزوار على أعلى مستوى. تخضع جميع التقارير الطبية، الفحوصات المخبرية، صور الأشعة، وبيانات التواصل المقدمة عبر موقعنا لمعايير صارمة للسرية الطبية وفق قوانين حماية البيانات التركية (<strong>KVKK</strong>) واللائحة الأوروبية لحماية البيانات (<strong>GDPR</strong>).</p>
<h2>2. البيانات التي نجمعها</h2>
<ul>
  <li><strong>بيانات الهوية والتواصل:</strong> الاسم الكامل، رقم الهاتف / واتساب، البريد الإلكتروني، وبلد الإقامة لتنسيق الاستشارة.</li>
  <li><strong>البيانات الطبية السريرية:</strong> وصف الحالة، التخصص المطلوب، والتقارير أو صور الأشعة المرفوعة طوعاً لغرض التقييم الطبي المجاني.</li>
  <li><strong>البيانات التقنية:</strong> معلومات التصفح الأساسية لتحسين أداء الموقع وقياس فعالية التواصل الطبي.</li>
</ul>
<h2>3. الغرض من معالجة البيانات الطبية</h2>
<p>تُستخدم معلوماتكم حصرياً لمشاركة الملف الطبي مع الأطباء الاستشاريين والمستشفيات التركية المعتمدة دولياً (<strong>JCI</strong>) لإعداد رأي طبي ثانٍ وخطة علاجية وعرض سعر رسمي، ولن يتم بيع أو مشاركة بياناتكم مع أي جهة تسويقية خارجية.</p>
<h2>4. تخزين الملفات وأمن المعلومات</h2>
<p>يتم نقل البيانات عبر تشفير HTTPS/TLS، وتُحفظ الملفات الطبية المرفوعة في مستودعات محمية لا يصل إليها إلا المنسق الطبي المخول وفريق الأطباء المشرف على الحالة.</p>
<h2>5. حقوق المريض والاتصال بنا</h2>
<p>يحق لكم في أي وقت طلب الاطلاع على بياناتكم أو تعديلها أو حذف ملفاتكم الطبية نهائياً عبر التواصل المباشر على <a href="mailto:contact@avicinna-health.com">contact@avicinna-health.com</a> أو عبر <a href="/contact">صفحة اتصل بنا</a>.</p>
      `.trim(),
      en: `
<h2>1. Commitment to Medical Confidentiality</h2>
<p><strong>AVICINNA International Healthcare</strong> treats every patient record and inquiry with strict medical confidentiality. All clinical histories, diagnostic scans, and personal details shared through our platform are safeguarded under Turkish Personal Data Protection Law (<strong>KVKK</strong>), the EU <strong>GDPR</strong>, and international healthcare privacy standards.</p>
<h2>2. Information We Collect</h2>
<ul>
  <li><strong>Identity & Contact Information:</strong> Full name, phone/WhatsApp number, email address, and country of residence.</li>
  <li><strong>Clinical & Diagnostic Records:</strong> Symptoms summary, requested specialty, and medical documents voluntarily uploaded for physician review.</li>
  <li><strong>Technical Analytics:</strong> Anonymous performance and conversion diagnostics when enabled to improve patient access.</li>
</ul>
<h2>3. How Your Medical Information Is Used</h2>
<p>Your health data is used solely to coordinate medical evaluations with board-certified physicians at <strong>JCI-accredited partner hospitals</strong> in Turkey, prepare individualized treatment plans, and arrange medical travel logistics. We never sell or rent patient data to third parties.</p>
<h2>4. Data Security & Retention</h2>
<p>All submissions are encrypted in transit via TLS, stored behind role-based administrative access controls with multi-factor authentication, and retained only as long as required for clinical coordination or legal compliance.</p>
<h2>5. Your Rights & Contact</h2>
<p>You may request access, correction, or permanent erasure of your medical records at any time by writing to <a href="mailto:contact@avicinna-health.com">contact@avicinna-health.com</a> or visiting our <a href="/en/contact">Contact page</a>.</p>
      `.trim(),
      fr: `
<h2>1. Engagement envers le Secret Médical</h2>
<p><strong>AVICINNA International Healthcare</strong> protège avec la plus grande rigueur la confidentialité de vos données de santé. Toutes les informations transmises sont traitées conformément à la loi turque sur la protection des données (<strong>KVKK</strong>), au <strong>RGPD</strong> européen et aux standards internationaux de confidentialité médicale.</p>
<h2>2. Données Collectées</h2>
<ul>
  <li><strong>Coordonnées :</strong> Nom complet, numéro de téléphone / WhatsApp, adresse e-mail et pays de résidence.</li>
  <li><strong>Dossier Médical :</strong> Description de votre situation clinique, spécialité recherchée et comptes-rendus ou imageries transmis volontairement pour avis médical.</li>
  <li><strong>Données Techniques :</strong> Mesures anonymisées de performance et de suivi de conversion lorsque activées.</li>
</ul>
<h2>3. Utilisation des Données de Santé</h2>
<p>Vos documents médicaux sont transmis exclusivement aux médecins référents et hôpitaux turcs accrédités <strong>JCI</strong> dans le but d’établir un avis médical, un protocole thérapeutique et un devis transparent. Aucune donnée n’est vendue ou cédée à des tiers commerciaux.</p>
<h2>4. Sécurité & Conservation</h2>
<p>Les transferts sont chiffrés via HTTPS/TLS et l’accès aux pièces médicales est strictement restreint aux coordinateurs médicaux habilités sous contrôle d’accès et authentification multi-facteurs.</p>
<h2>5. Vos Droits</h2>
<p>Vous disposez d’un droit d’accès, de rectification et de suppression définitive de votre dossier médical à tout moment en écrivant à <a href="mailto:contact@avicinna-health.com">contact@avicinna-health.com</a> ou via la <a href="/fr/contact">page Contact</a>.</p>
      `.trim(),
    },
    seo: {
      ar: {
        title: 'سياسة الخصوصية وحماية البيانات الطبية | أفيسينا AVICINNA',
        description: 'تعرف على التزام منصة أفيسينا بسرية التقارير الطبية وبيانات المرضى الدوليين وفق معايير GDPR وKVKK.',
        focusKeyword: 'سياسة الخصوصية أفيسينا',
      },
      en: {
        title: 'Privacy Policy & Medical Data Confidentiality | AVICINNA',
        description: 'Learn how AVICINNA protects patient identity, medical reports, and diagnostic scans under GDPR and KVKK.',
        focusKeyword: 'AVICINNA privacy policy',
      },
      fr: {
        title: 'Politique de Confidentialité & Secret Médical | AVICINNA',
        description: 'Découvrez comment AVICINNA protège vos dossiers médicaux et données personnelles selon les normes RGPD et KVKK.',
        focusKeyword: 'politique de confidentialité AVICINNA',
      },
    },
    status: 'published',
    isSystem: true,
    showInFooter: true,
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-11-10T10:00:00Z',
  },
  {
    id: 'page-terms',
    slug: 'terms',
    slugs: {
      ar: 'terms',
      en: 'terms',
      fr: 'terms',
    },
    title: {
      ar: 'الشروط والأحكام وإخلاء المسؤولية الطبي',
      en: 'Terms & Conditions & Medical Disclaimer',
      fr: 'Conditions Générales & Avertissement Médical',
    },
    subtitle: {
      ar: 'الشروط المنظمة لاستخدام منصة أفيسينا وخدمات التنسيق الطبي والاستشارات عن بُعد في تركيا.',
      en: 'Terms governing use of the AVICINNA healthcare coordination platform and international patient services in Turkey.',
      fr: 'Conditions régissant l’utilisation de la plateforme AVICINNA et les services de coordination médicale en Turquie.',
    },
    contentHtml: {
      ar: `
<h2>1. طبيعة خدمات منصة AVICINNA</h2>
<p>تعمل منصة <strong>AVICINNA</strong> كمنسق وميسر للرعاية الصحية الدولية يربط المرضى بالمستشفيات المعتمدة دولياً والأطباء الاستشاريين في الجمهورية التركية. المعلومات المنشورة على الموقع تهدف للتوعية الصحية ولا تشكل بديلاً عن الفحص السريري المباشر.</p>
<h2>2. الاستشارات الأولية وعروض الأسعار</h2>
<ul>
  <li>التقييم المبدئي للتقارير الطبية مجاني تماماً ولا يفرض أي التزام مالي على المريض.</li>
  <li>خطة العلاج النهائية والتكلفة الدقيقة تعتمد على الفحص السريري المباشر والفحوصات التأكيدية عند الوصول إلى المستشفى في إسطنبول.</li>
</ul>
<h2>3. التزامات المريض</h2>
<p>يلتزم المستخدم بتقديم معلومات صحية دقيقة وصحيحة عند تعبئة نماذج الاستشارة لضمان سلامة التقييم الطبي المبدئي من قبل الفريق الجراحي.</p>
<h2>4. الملكية الفكرية والتواصل الرسمي</h2>
<p>جميع المحتويات الطبية والنصوص والرسوم على الموقع مملوكة لمنصة AVICINNA. لأي استفسارات قانونية أو إدارية يرجى التواصل عبر <a href="/contact">نموذج الاتصال الرسمي</a>.</p>
      `.trim(),
      en: `
<h2>1. Scope of AVICINNA Coordination Services</h2>
<p><strong>AVICINNA</strong> operates as an international medical coordination platform connecting patients with JCI-accredited hospitals and board-certified specialists in Turkey. Educational content on this website does not substitute for an in-person clinical examination or emergency medical care.</p>
<h2>2. Preliminary Medical Assessments & Quotes</h2>
<ul>
  <li>Preliminary case evaluations and treatment estimates provided prior to travel are complimentary and carry zero financial obligation.</li>
  <li>Final surgical or therapeutic protocols are confirmed by the attending physician following in-person clinical diagnostics upon arrival in Istanbul.</li>
</ul>
<h2>3. Accuracy of Submitted Records</h2>
<p>Patients agree to provide accurate medical histories, current medications, and authentic diagnostic reports so specialist boards can prepare safe preliminary recommendations.</p>
<h2>4. Intellectual Property & Governing Contact</h2>
<p>All clinical guides, branding, and visual assets belong to AVICINNA. For inquiries regarding these terms, please reach us via our <a href="/en/contact">Contact page</a>.</p>
      `.trim(),
      fr: `
<h2>1. Nature des Services AVICINNA</h2>
<p><strong>AVICINNA</strong> agit en tant que plateforme internationale de coordination médicale mettant les patients en relation avec des hôpitaux accrédités JCI et des spécialistes qualifiés en Turquie. Les contenus informatifs du site ne remplacent en aucun cas une consultation médicale en présentiel.</p>
<h2>2. Avis Préliminaires & Devis</h2>
<ul>
  <li>L’étude initiale du dossier médical et l’estimation tarifaire sont entièrement gratuites et sans engagement.</li>
  <li>Le protocole thérapeutique définitif est validé par le médecin traitant après examen clinique et bilan sur place à Istanbul.</li>
</ul>
<h2>3. Exactitude des Informations Médicales</h2>
<p>Le patient s’engage à transmettre des antécédents complets et des examens médicaux authentiques afin de garantir la pertinence de l’évaluation préliminaire.</p>
<h2>4. Propriété Intellectuelle & Contact</h2>
<p>L’ensemble des contenus éditoriaux et médicaux appartient à AVICINNA. Pour toute question, veuillez utiliser notre <a href="/fr/contact">formulaire de contact</a>.</p>
      `.trim(),
    },
    seo: {
      ar: {
        title: 'الشروط والأحكام وإخلاء المسؤولية | أفيسينا AVICINNA',
        description: 'الشروط والأحكام المنظمة لخدمات التنسيق الطبي والاستشارات الدولية عبر منصة أفيسينا في تركيا.',
        focusKeyword: 'الشروط والأحكام أفيسينا',
      },
      en: {
        title: 'Terms & Conditions & Medical Disclaimer | AVICINNA',
        description: 'Read the terms of service and medical disclaimer governing AVICINNA international healthcare coordination in Turkey.',
        focusKeyword: 'AVICINNA terms and conditions',
      },
      fr: {
        title: 'Conditions Générales & Avertissement Médical | AVICINNA',
        description: 'Consultez les conditions générales et mentions médicales encadrant les services AVICINNA en Turquie.',
        focusKeyword: 'conditions générales AVICINNA',
      },
    },
    status: 'published',
    isSystem: true,
    showInFooter: true,
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-11-10T10:00:00Z',
  },
];

