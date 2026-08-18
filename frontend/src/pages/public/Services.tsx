import { useEffect, useState } from 'react';
import type { Page, Service } from '../../types';
import { listServices } from '../../services/services';
import { PawIcon, ClockIcon, CheckIcon, ArrowRightIcon } from '../../components/Icons';

interface Props { onNavigate: (page: Page) => void }

export default function Services({ onNavigate }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listServices().then(setServices).finally(() => setLoading(false));
  }, []);

  const active = services.filter(s => s.active);

  return (
    <div className="min-h-screen bg-[#DDD5CD]">
      <section className="bg-[#223143] py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#872B35] mb-2">Catálogo</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Nossos serviços</h1>
          <p className="text-[#DDD5CD]/70 text-lg max-w-xl mx-auto">Tudo que seu pet precisa com qualidade, carinho e profissionalismo. Agende pelo app com facilidade.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {loading ? (
          <p className="text-center text-[#536273] text-sm">Carregando…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-[#DDD5CD] overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-2 bg-[#872B35]" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-[#DDD5CD] rounded-xl flex items-center justify-center group-hover:bg-[#872B35] transition-colors">
                      <PawIcon size={20} className="text-[#536273] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-2xl font-bold text-[#872B35] font-display">R$ {s.price}</span>
                  </div>
                  <h3 className="font-semibold text-[#131B24] text-xl mb-2">{s.name}</h3>
                  <p className="text-[#536273] text-sm leading-relaxed mb-4">{s.description}</p>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-[#536273]">
                      <ClockIcon size={14} />
                      <span>Duração estimada: {s.duration} minutos</span>
                    </div>
                    {s.species.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-[#536273]">
                        <CheckIcon size={14} />
                        <span>Espécies: {s.species.join(', ')}</span>
                      </div>
                    )}
                    {s.sizes.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-[#536273]">
                        <CheckIcon size={14} />
                        <span>Portes: {s.sizes.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full bg-[#872B35] hover:bg-[#6e2029] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Agendar <ArrowRightIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-[#223143] rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Não encontrou o que procura?</h2>
          <p className="text-[#DDD5CD]/70 mb-6">Entre em contato e vamos criar um pacote personalizado para o seu pet.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+551134567890" className="bg-white text-[#223143] font-semibold px-6 py-2.5 rounded-xl hover:bg-[#DDD5CD] transition-colors text-sm">
              📞 Ligar agora
            </a>
            <button onClick={() => onNavigate('login')} className="border border-white/30 text-white font-medium px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
              Criar conta
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
