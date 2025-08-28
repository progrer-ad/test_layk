
import Head from "next/head";
import { useTranslation } from 'react-i18next'

export default function MotivationalQuotesSection() {
  const { t } = useTranslation('common')

  return (
    <>
       <Head>
        <title>{t('motiv.hero.title')}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700;900&family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="hero">
        {/* Gradient blobs */}
        <div className="blob one"></div>
        <div className="blob two"></div>
        <div className="blob three"></div>

        {/* Left side */}
        <div className="text-side">
          <h1>{t('motiv.hero.title')}</h1>
          <p>
            {t('motiv.hero.subtitle')}
          </p>
          <div className="quotes">
            <div className="quote-line">{t('motiv.quotes.quote1')}</div>
            <div className="quote-line">
              {t('motiv.quotes.quote2')}
            </div>
            <div className="quote-line kant">{t('motiv.quotes.author')}</div>
            <div className="quote-line">
              {t('motiv.quotes.quote3')}
            </div>
            <div className="quote-line">
              {t('motiv.quotes.quote4')}
            </div>
            <div className="quote-line highlight1">{t('motiv.quotes.highlight1')}</div>
            <div className="quote-line highlight2">{t('motiv.quotes.highlight2')}</div>
          </div>
        </div>

        {/* Right side */}
        <div className="image-side">
          <img
            src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80"
            alt="Community illustration"
          />
        </div>
      </div>

      {/* Scoped styles */}
      <style jsx>{`
        body {
          width: 70%;
          margin: 0;
          font-family: Poppins, sans-serif;
          background: linear-gradient(135deg, #fff5f7, #ffe4ec, #fbcfe8);
          color: #333;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-x: hidden;
        }
        .hero {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5% 20%;
          position: relative;
          overflow: hidden;
          
        }
        /* Gradient blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
          animation: float 12s infinite ease-in-out;
          z-index: 0;
        }
        .blob.one {
          width: 400px;
          height: 400px;
          background: #f472b6;
          top: -120px;
          left: -120px;
        }
        .blob.two {
          width: 300px;
          height: 300px;
          background: #ec4899;
          bottom: -150px;
          right: -100px;
          animation-delay: 4s;
        }
        .blob.three {
          width: 250px;
          height: 250px;
          background: #f9a8d4;
          top: 50%;
          left: 60%;
          transform: translate(-50%, -50%);
          animation-delay: 8s;
        }
        .text-side {
          flex: 1 1 500px;
          z-index: 2;
          opacity: 0;
          transform: translateY(40px);
          animation: fadeUp 1s ease forwards;
          animation-delay: 0.3s;
        }
        .text-side h1 {
          font-family: "Playfair Display", serif;
          font-size: 68px;
          margin: 0 0 25px;
          color: #ec4899;
          line-height: 1.1;
        }
        .text-side p {
          font-size: 20px;
          color: #444;
          max-width: 520px;
          margin-bottom: 40px;
        }
        .quotes {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          padding: 28px;
          font-size: 17px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          margin-bottom: 35px;
          transition: transform 0.3s;
        }
        .quotes:hover {
          transform: translateY(-6px);
        }
        .quote-line {
          margin: 10px 0;
          font-weight: 600;
        }
        .quote-line.kant {
          font-style: italic;
          color: #555;
          font-weight: 400;
        }
        .quote-line.highlight1 {
          font-size: 20px;
          font-weight: 900;
          color: #ec4899;
        }
        .quote-line.highlight2 {
          font-size: 18px;
          font-weight: 700;
          color: #f472b6;
        }
        .cta {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
        }
        .cta-btn {
          background: linear-gradient(90deg, #ec4899, #f472b6);
          color: white;
          padding: 15px 34px;
          border: none;
          border-radius: 999px;
          font-weight: 700;
          font-size: 17px;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(236, 72, 153, 0.3);
          transition: all 0.25s ease;
          animation: pulse 3s infinite;
        }
        .cta-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 35px rgba(236, 72, 153, 0.5);
        }
        .image-side {
          flex: 1 1 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          opacity: 0;
          transform: translateY(60px);
          animation: fadeUp 1.3s ease forwards;
          animation-delay: 0.7s;
        }
        .image-side img {
          max-width: 92%;
          border-radius: 28px;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.15);
          transition: transform 0.4s;
        }
        .image-side img:hover {
          transform: scale(1.03) rotate(-1deg);
        }
        /* Animations */
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.07);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-40px);
          }
        }
        /* Responsive */
        @media (max-width: 1100px) {
          .hero {
            flex-direction: column;
            text-align: center;
            /* Center the hero container for smaller screens */
            align-items: center;
          }
          .text-side {
            /* Center the text content within the text-side container */
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .text-side h1 {
            font-size: 48px;
          }
          .text-side p {
            font-size: 18px;
            margin: 0 auto 25px;
            /* Added margin auto to center the paragraph */
          }
          .quotes {
            margin: 0 auto 25px;
            text-align: left;
          }
          .cta {
            /* Center the buttons within the cta container */
            justify-content: center;
          }
          .image-side {
            margin-top: 40px;
          }
        }
        @media (max-width: 600px) {
          .text-side h1 {
            font-size: 34px;
          }
          .cta-btn {
            padding: 12px 26px;
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
}