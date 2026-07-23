import React from 'react';
import styled from 'styled-components';

// Encontrei uma API bem interessante para usar na busca
// https://www.algolia.com/

const SearchBoxContainer = styled.div`
  width: 300px;
  height: 30px;
  margin-top: 4px;`

const SearchInputContainer = styled.div`
  display: flex;
  height: 100%;
  background-color: #EDEBEB;
  border-radius: 20px;
  align-items: center;
  display: flex;`

const SearchInput = styled.input`
  width: 300px;
  height: 100%;
  background-color: transparent;
  padding-left: 10px;
  border: 0px;
  outline: none;
  font-size: 12px;`

const SearchButton = styled.button`
  display: flex;
  margin-right: 5px;
  background-color: #156284;
  color: white;
  width: 50px;
  height: 20px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  align-content: center;
  vertical-align: middle;
  border: 0px;
  outline: none;`

function SearchBox() {
  return <SearchBoxContainer>
    <SearchInputContainer>
      <SearchInput placeholder="Pesquisar sensores e gateways"></SearchInput>
      <SearchButton>
        <i className="fa fa-search" style={{ display: 'flex' }}></i>
      </SearchButton>
    </SearchInputContainer>
  </SearchBoxContainer>;
}

export default SearchBox;