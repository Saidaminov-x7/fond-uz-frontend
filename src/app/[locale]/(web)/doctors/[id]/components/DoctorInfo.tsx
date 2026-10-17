import Image from "next/image";
import { Link } from "@/src/i18n/routing";

type Doctor = {
  id: string;
  name: string;
  profession: string;
  bio: string;
  image: string;
  email: string;
  phone: string;
};

type Props = {
  doctor: Doctor;
  backText: string;
  emailText: string;
  phoneText: string;
  aboutText: string;
};

export function DoctorInfo({ doctor, backText, emailText, phoneText, aboutText }: Props) {
  return (
    <>
      <Link href="/doctors" className="text-sm text-muted-foreground hover:text-foreground transition-colors group">
        <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> {backText}
      </Link>
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
        <div className="relative h-[400px] overflow-hidden rounded-lg border border-border bg-card">
          <Image src={doctor.image} alt={doctor.name} fill unoptimized={doctor.image.startsWith("https://")} className="object-cover" priority />
        </div>
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl text-foreground md:text-4xl">{doctor.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">{doctor.profession}</p>
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <h2 className="font-serif text-xl border-b border-border/50 pb-4 mb-4">{aboutText}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{doctor.bio}</p>
          </div>
          <div className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground w-16">{emailText}:</span>
              <a href={`mailto:${doctor.email}`} className="text-primary hover:underline font-medium transition-colors">
                {doctor.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground w-16">{phoneText}:</span>
              <a href={`tel:${doctor.phone.replace(/\s/g, "")}`} className="text-primary hover:underline font-medium transition-colors">
                {doctor.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
