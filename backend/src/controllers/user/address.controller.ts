import { requireAuth } from "@middlewares/auth.middleware";
import { createAddress, deleteAddress, findAddressByUser, updateAddress, findAddressById } from "@services/prisma/address.service";

export async function createAddressResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    const { data } = args;
    
    return await createAddress(id, data);
}

export async function updateAddressResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    const { address_id, data } = args;
    
    return await updateAddress(address_id, id, data);
}

export async function deleteAddressResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    const { address_id } = args;
    
    return await deleteAddress(address_id, id);
}

export async function getUserAddressesResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    
    return await findAddressByUser(id);
}

export async function getAddressResolver(parent: any, args: any, context: any) {
    const { id } = requireAuth(context);
    const { address_id } = args;
    
    return await findAddressById(address_id, id);
}
