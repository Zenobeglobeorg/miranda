"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, GraduationCap, Users, FolderOpen } from "lucide-react";
import { getWhatsAppAbonnementUrl } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import BoutonCommencer from "@/components/BoutonCommencer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, amount: 0.2 };

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        -------------------------------------------
        SECTION 1: HERO (Image + Message + CTA) 
        -------------------------------------------
      */}
      <section className="relative py-16 md:py-24 px-4 md:px-30 lg:px-30 flex flex-col md:flex-row items-center justify-center overflow-hidden bg-white gap-8 md:gap-12">
        {/* Content */}
        <motion.div
          className="relative px-4 text-center md:text-left max-w-4xl md:max-w-none"
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium text-sm mb-4"
          >
            🎓 Votre succès commence ici
          </motion.div>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-slate-900 mb-6"
          >
            Accédez aux meilleures <span className="text-slate-900">épreuves et corrections</span> pour exceller
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto md:mx-0 mb-8"
          >
            La plateforme de référence pour les étudiants de Prepas Vogt. Téléchargez des concours, devoirs et sujets d'examen pour préparer votre avenir.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
          >
            <BoutonCommencer />
            <Link
              href="/epreuves"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-center gap-2 text-center text-sm"
            >
              Explorer les épreuves
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <Image src="/heros.jpg" alt="Étudiants apprenant ensemble" width={540} height={240} className="rounded-2xl w-full max-w-md md:max-w-lg object-cover" />
        </motion.div>
      </section>

      {/* 
        -------------------------------------------
          SECTION 2: PREPAS VOGT (About) 
        -------------------------------------------
      */}
      <section className="py-12 md:py-16 lg:py-20 bg-slate-50 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">À propos de Miranda & Prepas Vogt</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Née de l'excellence académique du <strong>Prepas Vogt</strong>, cette application a été conçue pour offrir aux élèves un accès illimité aux ressources pédagogiques.
                Que vous soyez en Niveau 1 ou Niveau 2, nous centralisons toutes les épreuves passées pour faciliter vos révisions.
              </p>
              <ul className="space-y-3 text-slate-900">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>Archives complètes de toutes les filières</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>Corrections détaillées par des experts</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>Accessible 24h/24 et 7j/7</span>
                </li>
              </ul>
              <div className="pt-4 flex gap-4">
                <Link href="/concours" className="relative font-medium flex hover:scale-105 items-center gap-1 text-slate-900 hover:after:w-full hover:after:scale-100 after:origin-center after:transition-all after:duration-900 after:scale-0 after:h-0.5 after:bg-slate-900 after:absolute after:bottom-0 after:left-0 rounded-[50px] transition-all duration-300">
                  Voir les Concours <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-slate-100"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-transparent flex items-center justify-center">
                <GraduationCap className="h-32 w-32 text-slate-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 3: PRICING (Subscription) 
        -------------------------------------------
      */}
      <section className="py-12 md:py-16 lg:py-20 bg-white px-4 md:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Investissez dans votre réussite
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="text-slate-600 mb-12 max-w-2xl mx-auto"
          >
            Un abonnement unique et abordable pour accéder à l'intégralité de notre bibliothèque numérique pendant toute l'année scolaire.
          </motion.p>

          <motion.div
            className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transition-transform hover:-translate-y-1 duration-300"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="p-8">
              <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide pb-[10%]">Accès Premium</div>
              <div className="flex items-baseline justify-center gap-1 mb-6 py-[15%] text-center bg-slate-50 rounded-2xl p-4">
                <span className="text-5xl font-extrabold text-slate-900">1 000</span>
                <span className="text-xl text-slate-500">FCFA / an</span>
              </div>

              <a
                href={getWhatsAppAbonnementUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 px-4 text-center bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
              >
                Je m&apos;abonne maintenant
              </a>
              <ul className="space-y-4 text-left mb-8 p-[5%] text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Téléchargements illimités</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Accès à toutes les filières</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Sujets de Concours & Examens</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Mises à jour quotidiennes</span>
                </li>
              </ul>

              <p className="text-xs text-slate-400 mt-4">
                Paiement sécurisé via Mobile Money. Annulable à tout moment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 4: CATEGORIES (Selection) 
        -------------------------------------------
      */}
      <section className="py-12 md:py-16 lg:py-20 bg-slate-50 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4">Explorez par Niveau</h2>
            <p className="text-slate-600">Choisissez votre niveau pour accéder aux matières et épreuves correspondantes.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            {/* Niveau 1 */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Link href="/epreuves/niveau-1" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white border border-slate-100 block">
                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
                <div className="p-8 flex flex-col items-center text-center space-y-4 relative">
                  <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <FolderOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Niveau 1</h3>
                  <p className="text-slate-600">
                    Accédez aux filières SPH1, IGC1, MF1, IGEA1, INGE1
                  </p>
                  <span className="text-slate-900 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Niveau 2 */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            >
              <Link href="/epreuves/niveau-2" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white border border-slate-100 block">
                <div className="absolute inset-0 bg-purple-600/5 group-hover:bg-purple-600/10 transition-colors" />
                <div className="p-8 flex flex-col items-center text-center space-y-4 relative">
                  <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <FolderOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Niveau 2</h3>
                  <p className="text-slate-600">
                    Accédez aux filières SPH2, IGC2, MF2, IGEA2, INGE2
                  </p>
                  <span className="text-slate-900 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
        -------------------------------------------
        SECTION 5: BONUS (Why Us) 
        -------------------------------------------
      */}
      <section className="py-12 md:py-16 lg:py-20 bg-white px-4 md:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xl md:text-2xl font-bold text-slate-900 mb-8 md:mb-12"
          >
            Pourquoi des milliers d'étudiants nous font confiance ?
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <motion.div
              className="flex flex-col items-center gap-2 bg-slate-50 text-slate-900 rounded-2xl p-4 hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Users className="h-8 w-8 md:h-10 md:w-10 text-slate-700 mb-2" />
              <span className="text-2xl md:text-4xl font-bold">500+</span>
              <span className="text-xs md:text-sm text-slate-600">Étudiants actifs</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-2 bg-slate-50 text-slate-900 rounded-2xl p-4 hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            >
              <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-slate-700 mb-2" />
              <span className="text-2xl md:text-4xl font-bold">1000+</span>
              <span className="text-xs md:text-sm text-slate-600">Épreuves disponibles</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-2 bg-slate-50 text-slate-900 rounded-2xl p-4 hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-slate-700 mb-2" />
              <span className="text-2xl md:text-4xl font-bold">100%</span>
              <span className="text-xs md:text-sm text-slate-600">Fiabilité</span>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-2 bg-slate-50 text-slate-900 rounded-2xl p-4 hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            >
              <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-slate-700 mb-2" />
              <span className="text-2xl md:text-4xl font-bold">24/7</span>
              <span className="text-xs md:text-sm text-slate-600">Accès illimité</span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
