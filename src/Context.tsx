import { createContext, createSignal } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";
import type { JSX } from "solid-js";
import type { QueryClient, Query } from "@tanstack/solid-query";

export const QueryContext = createContext();

type queryProvider = {
  children: JSX.Element
}

type queryProviderPlus = queryProvider & JSX.Element

export function QueryProvider (props: queryProviderPlus): JSX.Element {
  const queryClient: QueryClient = useQueryClient();

  const [activeQuery, setActiveQuery] = createSignal<any>();
  const [queries, setQueries] = createSignal<Query[]>([]);
  const [sort, setSort] = createSignal<{type: string, reverse: boolean}>({type: 'last-updated', reverse: false});
  const [filter, setFilter] = createSignal<{text: string, status: string}>({text: '', status: ''});

  //showData & showModal
  const [showModal, setShowModal] = createSignal<boolean>(false);


  //subscribing to the query cache, which runs the function every time the queryCache updates 
  // TD changed queryCache to getQueryCache() and queries to getAll() --> prior were private types and inaccessible in TypeScript
  queryClient.getQueryCache().subscribe(() => {
    setQueries(() => [...queryClient.getQueryCache().getAll()]);
    if (activeQuery()) {
      setActiveQuery({...queries().filter((query) => query.queryHash == activeQuery().queryHash)[0]});
    };
  });

  return (
    <QueryContext.Provider value={{filter, setFilter, sort, setSort, queries, setQueries, activeQuery, setActiveQuery, showModal, setShowModal}}>
      {props.children}
    </QueryContext.Provider>
  )
}