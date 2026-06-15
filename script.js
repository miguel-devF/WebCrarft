/* =============================================
   WEBCRAFT — script.js
   ============================================= */

// ===== CURSOR PERSONALIZADO =====
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Trail com suavização
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Efeito nos links/botões
document.querySelectorAll('a, button, .step, .trust-card, .dep-card, .servico-item, .seg-pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '22px';
    cursor.style.height = '22px';
    cursorTrail.style.width  = '52px';
    cursorTrail.style.height = '52px';
    cursorTrail.style.opacity = '0.25';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '14px';
    cursor.style.height = '14px';
    cursorTrail.style.width  = '38px';
    cursorTrail.style.height = '38px';
    cursorTrail.style.opacity = '0.5';
  });
});


// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});


// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navMobile  = document.getElementById('navMobile');

menuToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  const isOpen = navMobile.classList.contains('open');

  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Fecha o menu ao clicar num link
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    menuToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});


// ===== REVEAL ON SCROLL =====
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // escalonamento por índice dentro do pai
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.1) + 's';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));


// ===== CONTADOR DE ESTATÍSTICAS =====
function animateCount(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCount(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(num => statsObserver.observe(num));


// ===== TEXTO ROTATIVO NO HERO =====
// Estratégia: só muda o texto, sem mudar font-size nem estrutura
const words = ['vende', 'cresce', 'converte', 'atrai', 'destaca'];
let wordIndex = 0;
const rotatingText = document.getElementById('rotatingText');

if (rotatingText) {
  // Espera a fonte carregar antes de iniciar a animação
  document.fonts.ready.then(() => {
    setInterval(() => {
      rotatingText.style.transition = 'opacity 0.25s ease';
      rotatingText.style.opacity = '0';

      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        rotatingText.textContent = words[wordIndex];
        rotatingText.style.opacity = '1';
      }, 260);
    }, 2800);
  });
}


// ===== FORMULÁRIO DE CONTATO — Formspree =====
const ctaForm = document.getElementById('ctaForm');
const formSuccess = document.getElementById('formSuccess');

if (ctaForm) {
  ctaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome     = document.getElementById('nome').value.trim();
    const negocio  = document.getElementById('negocio').value.trim();
    const ideia    = document.getElementById('ideia').value.trim();

    if (!nome || !whatsapp || !negocio) {
      shakeForm();
      return;
    }

    const btnText    = ctaForm.querySelector('.btn-text');
    const btnLoading = ctaForm.querySelector('.btn-loading');
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';

    const mensagem = `Olá! Vim pelo site e quero um orçamento.

   👤 Nome: ${nome}
   🏢 Negócio: ${negocio}
   💡 Ideia: ${ideia || 'Não informado'}`;

    const numero = '5527999999999'; // 👈 troca pelo seu número
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');

    formSuccess.style.display = 'block';
    ctaForm.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { formSuccess.style.display = 'none'; }, 6000);

    btnText.style.display    = 'inline';
    btnLoading.style.display = 'none';
  });
}
function shakeForm() {
  const box = document.querySelector('.cta-form');
  box.style.animation = 'none';
  box.offsetHeight; // reflow
  box.style.animation = 'shake 0.4s ease';
}

// Adiciona keyframe dinamicamente para shake
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);


// ===== SMOOTH SCROLL PARA LINKS ÂNCORA =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // altura do navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ===== HIGHLIGHT ATIVO NO NAVBAR =====
const sections = document.querySelectorAll('section[id]');
const navLinksList = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinksList.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = '#FF5C00';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));


// ===== PARALLAX SUTIL NO HERO =====
const heroBlobs = document.querySelectorAll('.blob');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  heroBlobs.forEach((blob, i) => {
    const speed = 0.08 + i * 0.04;
    blob.style.transform = `translateY(${scrollY * speed}px)`;
  });
});


// ===== LOG DE INICIALIZAÇÃO =====
console.log('%c✦ WebCraft carregado com sucesso!', 'color:#FF5C00;font-family:Syne,sans-serif;font-size:14px;font-weight:bold;');