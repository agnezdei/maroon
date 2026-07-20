import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SearchDataContext from "../../../context/SearchDataContext";
import CardsSection from "../../CardsSection/CardsSection";
import FilterSection from "../FilterSection/FilterSection";
import NavigateBlock from "../../NavigateBlock/NavigateBlock";
import { FilterDefaultData, FACE_CATEGORIES, BODY_CATEGORIES } from "../../../utils/consts";
import { TypeOfSettingsFilter } from "../../../types/filter";
import { TypeOfItem } from "../../../types/item";
import { getItems, getMaxPage } from "../../../utils/catalog";
import { filterItems, getVisibleItems } from "../../../utils/filter";

function Catalog() {
  const maxItemsOnPage = 12;
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [searchData, setSearchData] = useState<TypeOfSettingsFilter>(() => {
    const initial = FilterDefaultData;
    if (!filterParam) return initial;

    if (filterParam === "face") {
      return {
        ...initial,
        face: [...FACE_CATEGORIES], // выбираем все категории для лица
      };
    }
    if (filterParam === "body") {
      return {
        ...initial,
        body: [...BODY_CATEGORIES], // выбираем все категории для тела
      };
    }
    return initial;
  });

  const [currentItems, setCurrentItems] = useState<TypeOfItem[]>(getItems());
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<TypeOfItem[]>([]);

  useEffect(() => {
    setCurrentItems(filterItems(searchData));
  }, [searchData]);

  useEffect(() => {
    setMaxPage(getMaxPage(currentItems, maxItemsOnPage));
  }, [currentItems, maxItemsOnPage]);

  const handleClickLeftButton = () => {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const handleClickRightButton = () => {
    if (currentPage === maxPage) {
      return;
    }
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const newItems = getVisibleItems(currentItems, maxItemsOnPage, currentPage);
    setVisibleItems(newItems);
  }, [currentItems, maxItemsOnPage, currentPage]);

  return (
    <SearchDataContext.Provider
      value={{
        searchData,
        setSearchData,
        currentItems,
        setCurrentItems,
      }}
    >
      <section>
        <FilterSection />
        <CardsSection
          items={visibleItems}
          emptyText={[
            "Упс! По данным запросам ничего не найдено.",
            "Попробуйте изменить настройки поиска.",
          ]}
        >
          <NavigateBlock
            isSwiper={false}
            onClickLeftButton={handleClickLeftButton}
            onClickRightButton={handleClickRightButton}
            page={currentPage}
            maxPage={maxPage}
          />
        </CardsSection>
      </section>
    </SearchDataContext.Provider>
  );
}

export default Catalog;
