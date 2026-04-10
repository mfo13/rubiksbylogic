// variável e função para carregar a estrutura do menu
let menuData = [];
async function loadMenuData(){
    const response = await fetch("components/menu.json");
    menuData = await response.json();
}

// função para ler componentes do menu
async function loadComponent(id,file) {
    const response = await fetch(file);
    const text = await response.text();
    document.getElementById(id).innerHTML = text;
}

// função de inicialização
async function init(){
    await loadComponent("banner","components/banner.html");
    await loadComponent("menu","components/menu.html");
    await loadComponent("footer","components/footer.html");
    await loadMenuData(); // carrega estrutura do menu aqui
    initMenu(); // chama só aqui
}

init();

// função para iniciar o menu
async function initMenu(){

    document.getElementById("menuRoot")
        .appendChild(createMenu(menuData));

    const menuBtn=document.getElementById("menuBtn");
    const closeBtn=document.getElementById("closeBtn");
    const sidebar=document.getElementById("sidebar");
    const overlay=document.getElementById("overlay");

    menuBtn.onclick=()=>{
        sidebar.classList.add("open");
        overlay.style.display="block";
    }

    closeBtn.onclick=closeMenu;
    overlay.onclick=closeMenu;

    function closeMenu(){
        sidebar.classList.remove("open");
        overlay.style.display="none";
    }

    /* fechar menu ao clicar em link no celular */
    document.querySelectorAll(".menu a").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth < 768) {
                closeMenu();
            }

        });

    });

    /* submenus */
    document.querySelectorAll(".has-submenu .menu-link")
    .forEach(link=>{
        link.onclick = (e)=>{
            const item = link.parentElement;
            const anchor = link.querySelector("a");

            const siblings = item.parentElement.children;

            // alterna o estado atual
            const isOpen = item.classList.toggle("open");

            // fecha irmãos
            Array.from(siblings).forEach(sib => {
                if(sib !== item){
                    sib.classList.remove("open");
                }
            });

            // salva estado UMA vez só
            let state = JSON.parse(localStorage.getItem("menuState")||"{}");

            Array.from(siblings).forEach(sib => {
                const sibId = sib.dataset.menu;
                if(sibId){
                    state[sibId] = false;
                }
            });

            const id = item.dataset.menu;
            if(id){
                state[id] = isOpen;
            }

            localStorage.setItem("menuState", JSON.stringify(state));

            // navegação
            if(e.target.tagName === "A" && anchor.href){
                e.preventDefault();
                setTimeout(()=>{
                    window.location.href = anchor.href;
                }, 250);
            }
        };
    });

    /* detectar página atual e manter o link do menu ativo*/
    const currentPath = window.location.pathname.replace(/\/$/, "");
    document.querySelectorAll(".menu a").forEach(link=>{
        try{
            const linkUrl = new URL(link.href, window.location.origin);

            // IGNORA LINKS EXTERNOS
            if(linkUrl.origin !== window.location.origin) return;

            const linkPath = linkUrl.pathname.replace(/\/$/, "");
           
            if(linkPath === currentPath){
                link.classList.add("active");

                let parent = link.closest(".menu-item");
                while(parent){
                    if(parent.classList.contains("has-submenu")){
                        parent.classList.add("open");
                    }
                    parent = parent.parentElement.closest(".menu-item");
                }
            }
        } catch(e){}
    });

    /* restaurar estado do menu */
    let savedState=JSON.parse(localStorage.getItem("menuState")||"{}");
    document.querySelectorAll(".has-submenu").forEach(item=>{
        let id=item.dataset.menu;
        if(savedState[id]){
            item.classList.add("open");
        }
    });

    /* garantir que o caminho ativo fique aberto e os outros fechados*/
    const activeLink = document.querySelector(".menu a.active");
    if(activeLink){
        // fecha TODOS os submenus primeiro
        document.querySelectorAll(".has-submenu").forEach(item=>{
            item.classList.remove("open");
        });

        // abre apenas o caminho do ativo
        let parent = activeLink.closest(".has-submenu");
        while(parent){
            parent.classList.add("open");
            parent = parent.parentElement.closest(".has-submenu");
        }

        // opcional: sincroniza com localStorage
        let state = {};

        document.querySelectorAll(".has-submenu.open").forEach(item=>{
            const id = item.dataset.menu;
            if(id){
                state[id] = true;
            }
        });

        localStorage.setItem("menuState", JSON.stringify(state));
    }

    /* evitar problema de redimensionamento de tela */
    window.addEventListener("resize",()=>{
        if(window.innerWidth >= 768){
            sidebar.style.left="0";
            overlay.style.display="none";
        }
    });

    /* restaurar a posição da scroll bar */
    const savedScroll = localStorage.getItem("menuScroll");
    if(savedScroll !== null){
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                sidebar.style.scrollBehavior = "auto";
                sidebar.scrollTop = parseInt(savedScroll, 10);
                localStorage.removeItem("menuScroll"); // limpa após usar
            });
        });
    }

    // salvar scroll do menu quando links são clicados na página e no menu
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");

        if (!link) return;

        // ignora links sem navegação real
        if (
            link.target === "_blank" ||
            link.href.startsWith("javascript:") ||
            link.href.startsWith("#")
        ) return;

        // só se for navegação interna
        const url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        // salva o scroll do menu
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            localStorage.setItem("menuScroll", sidebar.scrollTop);
        }
    });
    // idem para javascript
    window.addEventListener("beforeunload", () => {
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            localStorage.setItem("menuScroll", sidebar.scrollTop);
        }
    });
}

// função para criar o menu
function createMenu(items, parentId=""){

    let ul = document.createElement("ul");
    ul.className = "menu";

    items.forEach((item, index)=>{

        let li = document.createElement("li");
        li.className = "menu-item";

        // ID único e consistente
        
        let id = parentId ? `${parentId}-${index}` : `${index}`;
        li.dataset.menu = id;

        let linkDiv = document.createElement("div");
        linkDiv.className = "menu-link";

        let arrow = document.createElement("span");
        arrow.className = "arrow";
        /* seta nova ↷ ou ↻ */
        arrow.textContent = '↻';
                            
        let a = document.createElement("a");
        a.textContent = item.title;

        if(item.link){
            a.href = item.link;
        } else {
            a.href = "javascript:void(0)";
            a.classList.add("no-link");
        }

        // só adiciona seta se tiver children
        if(item.children){
            li.classList.add("has-submenu");
            linkDiv.appendChild(arrow);
        } else {
            arrow.classList.add("empty");
            linkDiv.appendChild(arrow);
        }

        // ORDEM CORRETA
        linkDiv.appendChild(a);
        li.appendChild(linkDiv);

        // submenu só é criado UMA VEZ e DEPOIS
        if(item.children){
            let sub = createMenu(item.children, id);
            sub.classList.add("submenu");
            li.appendChild(sub);
        }

        ul.appendChild(li);
    });

    return ul;
}
