// Esse hook é utilizado para controlar o funcionamento da barra de pesquisa

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  GroupWork,
  Tab,
  Business,
  RadioButtonUnchecked,
  SurroundSound,
  RadioButtonChecked,
} from "@mui/icons-material";
import { findNode, getGroupChildren, mountFullPath } from "../../utilities";
import { WhichRenderContext } from "../../contexts";

export default function useSearchBar(mobileMode) {
  const {
    treeData, // Arvore usada para fazer as buscas
    setSelectedNode,
    setSelectedNodeFullPath,
    setSelectedNodeChildren,
    setSpotPage,
    setWhichClicked,
  } = useContext(WhichRenderContext);

  // Indica se a barra está ativa/expandida/esperando um comando.
  const [activeSearchBar, setActiveSearchBar] = useState(false);
  // Armazena o que está sendo digitado
  const [searchTerm, setSearchTerm] = useState("");
  // Armazena os resultados da busca
  const [searchResult, setSearchResult] = useState([]);
  // Indica se os resultados estão visiveis ou não
  const [showResults, setShowResults] = useState(false);
  // Indica se os textos estão rolando
  const [slideText, setSlideText] = useState(false);
  // Indica se a busca está sendo feita
  const [searching, setSearching] = useState(false);

  // Usado para referenciar a barra de pesquisa
  const searchBarRef = useRef(null);

  // Usado para referenciar o input de texto
  const inputRef = useRef(null);

  // Usado pra controlar o momento que deve ser feita pesquisa
  const searchTimer = useRef(null);

  // Altera o estado da barra de busca, podendo ativar ou desativar
  const toggleSearchBarState = useCallback(
    (action) => {
      if (!action) {
        activeSearchBar && setActiveSearchBar(false);
      } else {
        !activeSearchBar && setActiveSearchBar(true);
      }
    },
    [activeSearchBar]
  );

  // Atualiza o estado do termo de busca
  const updateSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  // Limpa o input de texto
  const clearSearchTerm = () => {
    updateSearchTerm({ target: { value: "" } });
  };

  // Ativa o foco no input, para conseguir digitar clicando em qualquer lugar da barra de pesquisa
  const activateInputFocus = () => {
    inputRef.current.focus();
  };

  const addItemToResults = (tree, results, node) => {
    const { title, sensor_id, type, tree_id, children } = node;

    let icon;

    switch (type) {
      case "PLANT":
        icon = <Business />;
        break;
      case "SECTOR":
        icon = <Tab />;
        break;
      case "GROUP":
      case "set":
        icon = <GroupWork />;
        break;
      case "EQUIPMENT":
        icon = <SurroundSound />;
        break;
      default:
        icon = sensor_id ? (
          <RadioButtonChecked />
        ) : (
          <RadioButtonUnchecked />
        );
        break;
    }

    results.push({
      title: title,
      sensor_id: sensor_id,
      icon,
      tree_id: tree_id,
      path: mountFullPath(tree, tree_id, false, true),
    });

    if (children && children.length > 0) {
      children.forEach((child) => {
        addItemToResults(tree, results, child);
      })
    }
  }
  // Filtro para encontrar resultados do termo digitado dentro da árvore de ativos
  async function filterTreeBySearchTerm(tree, searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    const results = [];

    function search(node) {
      const { title, sensor_id, children } = node;

      if (
        title?.toLowerCase()?.includes(searchTerm) ||
        sensor_id?.toLowerCase()?.includes(searchTerm)
      ) 
        addItemToResults(tree, results, node)
      else {
        if (children && children.length > 0) {
          children.forEach((child) => {
            search(child)
          })
        }
      }
    }

    tree.forEach((item) => search(item));

    return await Promise.resolve(results);
  }

  // Ação ao clicar em um resultado
  const resultItemAction = (tree_id) => {
    const { node } = findNode(treeData, tree_id);
    sessionStorage.setItem(
      "whichClicked",
      JSON.stringify({
        tree_id: node.tree_id,
      })
    );
    setSelectedNode(node);
    setSelectedNodeFullPath(mountFullPath(treeData, tree_id, false));
    setSelectedNodeChildren(getGroupChildren(node));
    setWhichClicked({
      tree_id: node.tree_id,
    });
    setSpotPage("vibandtemp");
    toggleSearchBarState(false);
    clearSearchTerm();
  };

  // Caso o estado da barra de pesquisa ou o input de texto mude, os resultados são mostrados ou escondidos.
  useEffect(() => {
    const toggleResultVisibility = () => {
      if (activeSearchBar && searchTerm.length > 0) {
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    };

    toggleResultVisibility();
  }, [activeSearchBar, searchTerm]);

  // Identifica cliques fora da barra de pesquisa
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        toggleSearchBarState(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarRef, toggleSearchBarState]);

  // Bloqueia o scroll enquanto a barra mobile estiver ativa
  useEffect(() => {
    if (mobileMode) {
      activateInputFocus();

      if (activeSearchBar) {
        document.getElementById("ContainerMain").style.overflow = "hidden";
      } else {
        document.getElementById("ContainerMain").style.overflow = "hidden auto";
      }
    }
  }, [mobileMode, activeSearchBar]);

  // Caso a arvore seja atualizada, ou o input de texto mude, os resultados são atualizados
  useEffect(() => {
    // Função para realizar a pesquisa de maneira assíncrona
    async function performSearch() {
      const results = await filterTreeBySearchTerm(treeData, searchTerm);
      setSearchResult(results);
      setSearching(false);
    }

    clearTimeout(searchTimer.current);
    setSearchResult([]);
    setSearching(false);

    if (searchTerm.length > 0) {
      setSearching(true);
      searchTimer.current = setTimeout(() => {
        performSearch();
      }, 300);
    }

    return () => {
      clearTimeout(searchTimer.current);
    };
  }, [searchTerm, treeData]);

  return {
    activeSearchBar,
    toggleSearchBarState,
    showResults,
    searchTerm,
    updateSearchTerm,
    clearSearchTerm,
    inputRef,
    activateInputFocus,
    searchResult,
    resultItemAction,
    searchBarRef,
    slideText,
    setSlideText,
    searching,
  };
}
