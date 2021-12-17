package by.pisetskiy.iquiz.model.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
public class Employee extends BaseEntity {

    private String firstName;
    private String middleName;
    private String lastName;

    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private JobPosition jobPosition;
}
