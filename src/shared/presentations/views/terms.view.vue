<template>
  <section class="terms wrap">
    <div class="panel">
      <h1 class="title">Términos y Condiciones</h1>
      <p class="updated">Última actualización: 14/09/2026</p>

      <article class="content">
        <h2>1. Aceptación de los términos</h2>
        <p>Al crear una cuenta o usar PuntoSabor, aceptas estos Términos y Condiciones. Si no estás de acuerdo, no debes usar la plataforma.</p>

        <h2>2. Descripción del servicio</h2>
        <p>PuntoSabor es una plataforma que conecta a personas que buscan huariques (restaurantes populares) con los dueños de estos negocios. Permite explorar lugares por categoría y distrito, dejar reseñas y calificaciones, guardar favoritos, ver promociones y, para los dueños, publicar y administrar sus huariques.</p>

        <h2>3. Cuentas de usuario</h2>
        <ul>
          <li>Debes proporcionar información real y actualizada al registrarte (nombre, correo electrónico).</li>
          <li>Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.</li>
          <li>Debes notificarnos de inmediato ante cualquier uso no autorizado de tu cuenta.</li>
          <li>Puedes solicitar la eliminación de tu cuenta en cualquier momento.</li>
        </ul>

        <h2>4. Roles: Explorador y Dueño</h2>
        <ul>
          <li><strong>Explorador:</strong> puede buscar huariques, dejar reseñas, calificar y guardar favoritos.</li>
          <li><strong>Dueño:</strong> puede registrar y administrar huariques, publicar promociones y responder a reseñas de su negocio.</li>
          <li>Un dueño es responsable de que la información de su(s) huarique(s) (dirección, horarios, precios, fotos) sea veraz y esté actualizada.</li>
        </ul>

        <h2>5. Reseñas y contenido generado por usuarios</h2>
        <ul>
          <li>Las reseñas deben reflejar tu experiencia real y de buena fe.</li>
          <li>Está prohibido publicar contenido falso, difamatorio, ofensivo, discriminatorio o que infrinja derechos de terceros.</li>
          <li>PuntoSabor puede moderar, ocultar o eliminar contenido que incumpla estas normas, sin previo aviso.</li>
          <li>Al publicar contenido (reseñas, fotos, comentarios), otorgas a PuntoSabor una licencia no exclusiva para mostrarlo dentro de la plataforma.</li>
        </ul>

        <h2>6. Promociones y membresías</h2>
        <p>Las promociones publicadas por los dueños son responsabilidad exclusiva de cada huarique; PuntoSabor no garantiza su cumplimiento. Los planes de membresía y sus beneficios se detallan en la sección correspondiente y pueden cambiar con previo aviso.</p>

        <h2>7. Conducta del usuario</h2>
        <p>Te comprometes a no:</p>
        <ul>
          <li>Suplantar la identidad de otra persona o negocio.</li>
          <li>Usar la plataforma para fines fraudulentos o ilegales.</li>
          <li>Intentar vulnerar la seguridad del sistema o acceder a cuentas ajenas.</li>
          <li>Publicar spam o contenido no autorizado con fines comerciales.</li>
        </ul>

        <h2>8. Propiedad intelectual</h2>
        <p>El nombre, logo, diseño y código de PuntoSabor son propiedad de sus desarrolladores. El contenido generado por los usuarios sigue perteneciendo a quien lo publicó, bajo la licencia mencionada en el punto 5.</p>

        <h2>9. Limitación de responsabilidad</h2>
        <p>PuntoSabor es un intermediario informativo: no opera los huariques listados ni garantiza la calidad, higiene o veracidad de la información publicada por los dueños. Cualquier disputa entre explorador y dueño de un huarique debe resolverse directamente entre las partes.</p>

        <h2>10. Modificaciones</h2>
        <p>Podemos actualizar estos Términos en cualquier momento. Los cambios importantes se notificarán dentro de la plataforma. El uso continuado después de una actualización implica la aceptación de los nuevos términos.</p>

        <h2>11. Contacto</h2>
        <p>Para dudas sobre estos términos, puedes escribirnos a través de la sección de Contacto de la plataforma.</p>
      </article>

      <RouterLink to="/register" class="back-link">← Volver al registro</RouterLink>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TermsView'
};
</script>

<style scoped>
.terms.wrap {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}
.panel {
  max-width: 720px;
  width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.title {
  margin: 0 0 0.25rem;
  color: #6b3d1f;
}
.updated {
  color: #8a8a8a;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}
.content h2 {
  font-size: 1.05rem;
  color: #d9760a;
  margin: 1.25rem 0 0.4rem;
}
.content p, .content li {
  color: #4a4a4a;
  line-height: 1.55;
  font-size: 0.95rem;
}
.content ul {
  padding-left: 1.2rem;
}
.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: #d9760a;
  font-weight: 600;
  text-decoration: none;
}
.back-link:hover {
  text-decoration: underline;
}
</style>