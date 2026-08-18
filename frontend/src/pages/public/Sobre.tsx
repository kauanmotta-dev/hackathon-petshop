import type { Page } from '../../types';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from '../../components/Icons';

interface Props { onNavigate: (page: Page) => void }

export default function Sobre({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-[#DDD5CD]">
      <section className="bg-[#223143] py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#872B35] mb-2">Nossa história</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Sobre a Vitallis</h1>
          <p className="text-[#DDD5CD]/70 text-lg">Nascemos da paixão pelos animais e do compromisso com o bem-estar de cada pet.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#131B24] mb-4">Nossa missão</h2>
            <p className="text-[#536273] leading-relaxed mb-4">
              Fundada em 2023, a Vitallis nasceu com uma missão clara: oferecer aos pets de São Paulo o cuidado especializado que eles merecem, combinando profissionalismo, técnica e muito carinho.
            </p>
            <p className="text-[#536273] leading-relaxed mb-4">
              Nossa equipe é formada por banhistas certificados, constantemente atualizados nas melhores técnicas de higiene e bem-estar animal. Cada atendimento é personalizado, respeitando as particularidades de cada pet.
            </p>
            <p className="text-[#536273] leading-relaxed">
              Acreditamos que um pet bem cuidado é um pet feliz — e um tutor tranquilo é a melhor recompensa que podemos ter.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl h-72 bg-[#cfc6bc]">
            <img
              src="https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=600&h=400&fit=crop&auto=format"
              alt="Pet shop interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            { n: '500+', l: 'Pets atendidos', d: 'Desde nossa abertura em 2023' },
            { n: '4.9', l: 'Estrelas de avaliação', d: 'Média nas plataformas digitais' },
            { n: '100%', l: 'Satisfação garantida', d: 'Ou refazemos sem custo' },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-2xl border border-[#DDD5CD] p-6 text-center">
              <p className="font-display text-4xl font-bold text-[#872B35] mb-1">{s.n}</p>
              <p className="font-semibold text-[#131B24] text-sm">{s.l}</p>
              <p className="text-[#536273] text-xs mt-1">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#DDD5CD] p-8">
          <h2 className="font-display text-2xl font-bold text-[#131B24] mb-6">Onde nos encontrar</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { icon: <MapPinIcon size={18} />, label: 'Endereço', text: 'Rua das Flores, 142 — Pinheiros, São Paulo, SP — CEP 05401-001' },
                { icon: <PhoneIcon size={18} />, label: 'Telefone', text: '(11) 3456-7890' },
                { icon: <MailIcon size={18} />, label: 'E-mail', text: 'contato@vitallis.com.br' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-3">
                  <span className="text-[#872B35] mt-0.5">{c.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#536273]">{c.label}</p>
                    <p className="text-sm text-[#131B24] mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-start gap-3 mb-4">
                <span className="text-[#872B35] mt-0.5"><ClockIcon size={18} /></span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#536273]">Horário de funcionamento</p>
                  <div className="mt-1 space-y-1">
                    {[
                      ['Segunda a Sexta', '8h às 18h'],
                      ['Sábado', '8h às 14h'],
                      ['Domingo', 'Fechado'],
                    ].map(([d, h]) => (
                      <div key={d} className="flex justify-between text-sm text-[#131B24]">
                        <span>{d}</span>
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
