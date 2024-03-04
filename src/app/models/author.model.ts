export interface Author {
    uuid: string;
    name: string;
    updatedName?: string;
    updatedUuid?: string;
    editMode?: boolean;
}