import { useMediaQuery, Theme } from "@mui/material";
import { List, SimpleList, Datagrid, TextField, BooleanField } from "react-admin";

export default function CategoriesList() {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  
  return (
    <List title='Categorias de Esportes'>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name + " (" + record.alias + ")"}
          secondaryText={(record) => record.id}
          tertiaryText={(record) => record.fullName}
        />
      ) : (
        <Datagrid rowClick="edit">
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="description" />     
          <BooleanField source="active" />
        </Datagrid>
      )}
    </List>
  );
}
