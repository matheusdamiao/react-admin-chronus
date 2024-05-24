import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import CategoriesList from "./users";



export const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name='Category' list={CategoriesList} edit={EditGuesser}/>
  </Admin>
);
