using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interface
{
    public interface IService<T>
    {
        Task<List<T>> GetAll();
        Task<T> GetById(int id);

        Task<T> AddItem(T item);
        Task<T> UpdateItem(int id, T item);
        Task DeleteItem(int id);
    }
}
