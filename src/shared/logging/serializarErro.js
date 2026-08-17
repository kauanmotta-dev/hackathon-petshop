const CAMPOS_SENSIVEIS = ['senha', 'senhaHash', 'password', 'token', 'authorization', 'jwtSecret'];

function redigirCamposSensiveis(valor, profundidade = 0) {
  if (profundidade > 4 || valor === null || typeof valor !== 'object') {
    return valor;
  }
  const redigido = Array.isArray(valor) ? [] : {};
  for (const [chave, item] of Object.entries(valor)) {
    redigido[chave] = CAMPOS_SENSIVEIS.includes(chave)
      ? '[REDACTED]'
      : redigirCamposSensiveis(item, profundidade + 1);
  }
  return redigido;
}

/**
 * Serializa um erro para log, redigindo campos sensíveis. Usar em todo
 * `logger.error(...)` que loga um erro cru, para que a redação não fique
 * restrita a um único call site.
 */
export function serializarErro(err) {
  if (err === null || typeof err !== 'object') {
    return err;
  }
  return { message: err.message, stack: err.stack, ...redigirCamposSensiveis({ ...err }) };
}
