import { useEffect, useState } from 'react';
import type { Page, Service } from '../../types';
import { listServices } from '../../services/services';
import { PawIcon, CheckIcon, StarIcon, ArrowRightIcon, MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from '../../components/Icons';

interface Props { onNavigate: (page: Page) => void }

export default function Home({ onNavigate }: Props) {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    listServices().then(setServices).catch(() => {});
  }, []);

  const activeServices = services.filter(s => s.active).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#DDD5CD]">
      {/* Hero */}
      <section className="relative bg-[#223143] overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#872B35]/20 border border-[#872B35]/30 rounded-full px-4 py-1.5 text-[#DDD5CD] text-xs font-semibold mb-6 uppercase tracking-wide">
                <PawIcon size={14} className="text-[#872B35]" />
                Cuidado profissional
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                O melhor para quem você
                <span className="text-[#872B35]"> ama</span>
              </h1>
              <p className="text-[#DDD5CD]/70 text-lg leading-relaxed mb-8 max-w-lg">
                Banho, tosa e cuidados especializados para o seu pet. Equipe treinada, ambiente seguro e acolhedor, com agendamento fácil e notificações em tempo real.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('cadastro')}
                  className="bg-[#872B35] hover:bg-[#6e2029] text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  Agendar agora <ArrowRightIcon size={18} />
                </button>
                <button
                  onClick={() => onNavigate('servicos')}
                  className="border border-[#DDD5CD]/30 text-[#DDD5CD] hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Ver serviços
                </button>
              </div>
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
                {[['500+', 'Pets atendidos'], ['4.9★', 'Avaliação'], ['3', 'Anos de experiência']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display font-bold text-white text-xl">{n}</p>
                    <p className="text-[#DDD5CD]/50 text-xs mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=500&fit=crop&auto=format"
                  alt="Pet shop grooming"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#223143]/60 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckIcon size={18} className="text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-[#131B24] text-sm">Thor finalizado!</p>
                  <p className="text-[#536273] text-xs">Notificação enviada ao tutor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#872B35] mb-2">O que oferecemos</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#131B24]">Serviços para o seu pet</h2>
          <p className="text-[#536273] mt-3 max-w-xl mx-auto">Tudo que seu melhor amigo precisa, com profissionais especializados e produtos premium.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-[#DDD5CD] p-6 hover:shadow-lg transition-shadow group">
              <div className="w-10 h-10 bg-[#DDD5CD] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#872B35] transition-colors">
                <PawIcon size={20} className="text-[#536273] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-[#131B24] text-lg mb-1">{s.name}</h3>
              <p className="text-[#536273] text-sm mb-4 leading-relaxed">{s.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#872B35] font-bold text-lg">R$ {s.price}</span>
                <span className="text-xs text-[#536273] bg-[#DDD5CD] px-2.5 py-1 rounded-full">{s.duration} min</span>
              </div>
              <button
                onClick={() => onNavigate('login')}
                className="mt-4 w-full border border-[#872B35] text-[#872B35] hover:bg-[#872B35] hover:text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Agendar este serviço
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate('servicos')}
            className="inline-flex items-center gap-2 text-[#223143] font-medium hover:text-[#872B35] transition-colors"
          >
            Ver todos os serviços <ArrowRightIcon size={18} />
          </button>
        </div>
      </section>

      {/* Differentials */}
      <section className="bg-[#223143] py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-10">Por que a Vitallis?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔔', title: 'Notificação em tempo real', desc: 'Avisamos quando seu pet está pronto' },
              { icon: '📋', title: 'Prontuário digital', desc: 'Histórico completo de cada atendimento' },
              { icon: '🔒', title: 'Ambiente seguro', desc: 'Protocolos rigorosos de higiene e cuidado' },
              { icon: '📅', title: 'Agendamento online', desc: 'Marque pelo app a qualquer hora' },
            ].map(d => (
              <div key={d.title} className="text-center">
                <div className="text-3xl mb-3">{d.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{d.title}</h3>
                <p className="text-[#DDD5CD]/60 text-sm">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#872B35] mb-2">Depoimentos</p>
          <h2 className="font-display text-3xl font-bold text-[#131B24]">O que nossos clientes dizem</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: 'Ana Costa', pet: 'Tutora do Thor', text: 'Meu golden saiu lindo! A Fernanda tem um cuidado incrível com ele. Super recomendo!', rating: 5 },
            { name: 'Carlos Lima', pet: 'Tutor do Bolinha', text: 'Adoro receber a notificação quando o Bolinha fica pronto. Facilita muito minha rotina.', rating: 5 },
            { name: 'Patrícia Nunes', pet: 'Tutora da Luna', text: 'Atendimento impecável, equipe atenciosa e o preço é justo. Melhor pet shop da região!', rating: 5 },
          ].map(t => (
            <div key={t.name} className="bg-white rounded-2xl border border-[#DDD5CD] p-6">
              <div className="flex gap-0.5 mb-3">
                {Array(t.rating).fill(0).map((_, i) => <StarIcon key={i} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-[#536273] text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="font-semibold text-[#131B24] text-sm">{t.name}</p>
                <p className="text-[#536273] text-xs">{t.pet}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#872B35] py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <PawIcon size={40} className="text-white/40 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white mb-3">Pronto para agendar?</h2>
          <p className="text-white/80 mb-8">Crie sua conta gratuitamente e agende o primeiro banho com desconto especial.</p>
          <button
            onClick={() => onNavigate('cadastro')}
            className="bg-white text-[#872B35] font-bold px-8 py-3.5 rounded-xl hover:bg-[#DDD5CD] transition-colors"
          >
            Criar conta gratuita
          </button>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#872B35] mb-2">Nos encontre</p>
            <h2 className="font-display text-3xl font-bold text-[#131B24] mb-6">Localização e contato</h2>
            <div className="space-y-4">
              {[
                { icon: <MapPinIcon size={18} />, text: 'Rua das Flores, 142 — Pinheiros, São Paulo, SP' },
                { icon: <PhoneIcon size={18} />, text: '(11) 3456-7890' },
                { icon: <MailIcon size={18} />, text: 'contato@vitallis.com.br' },
                { icon: <ClockIcon size={18} />, text: 'Seg–Sex 8h às 18h · Sáb 8h às 14h' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3 text-[#536273]">
                  <span className="mt-0.5 flex-shrink-0">{c.icon}</span>
                  <span className="text-sm">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg h-56 bg-[#cfc6bc]">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=300&fit=crop&auto=format"
              alt="Pet shop exterior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
