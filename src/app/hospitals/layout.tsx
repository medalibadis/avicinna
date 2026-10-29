import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top JCI Hospitals & Medical Centers in Turkey | AVICINNA',
  description:
    'Discover Turkey’s top 11 accredited partner hospitals including Acıbadem Altunizade, Memorial Şişli, American Hospital, and Koç University Hospital. Filter by medical specialty and consult distinguished professors.',
  alternates: {
    canonical: 'https://avicinna.com/hospitals',
  },
  openGraph: {
    title: 'Top Accredited Partner Hospitals in Turkey | AVICINNA Healthcare',
    description:
      'Filter top JCI hospitals in Istanbul and Ankara by specialty, view medical faculty CVs, and request direct consultation via WhatsApp.',
    url: 'https://avicinna.com/hospitals',
    siteName: 'AVICINNA International Healthcare',
    images: [
      {
        url: '/images/hospitals/acibadem-altunizade.jpg',
        width: 1200,
        height: 630,
        alt: 'AVICINNA Partner Hospitals Turkey',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function HospitalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
